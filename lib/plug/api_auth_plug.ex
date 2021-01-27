defmodule RepeatNotesWeb.APIAuthPlug do
  @moduledoc false
  use Pow.Plug.Base

  alias Plug.Conn
  alias Pow.{Config, Plug, Store.CredentialsCache}
  alias PowPersistentSession.Store.PersistentSessionCache
  alias RepeatNotes.{Encryption.Pbkdf2, Encryption.AES}

  @impl true
  @spec fetch(Conn.t(), Config.t()) :: {Conn.t(), map() | nil}
  def fetch(conn, config) do
    conn
    |> fetch_auth_token(config)
    |> fetch_from_store(conn, config)
  end

  defp fetch_from_store(nil, conn, _config), do: {conn, nil}

  defp fetch_from_store(token, conn, config) do
    config
    |> store_config()
    |> CredentialsCache.get(token)
    |> case do
      :not_found ->
        {conn, nil}

      {user, metadata} ->
        case metadata do
          [secret_key: secret_key] ->
            conn = conn |> Conn.put_private(:secret_key, secret_key)
            {conn, user}
        end
    end
  end

  @impl true
  @spec create(Conn.t(), map(), Config.t()) :: {Conn.t(), map()}
  def create(conn, user, config) do
    store_config = store_config(config)
    token = Pow.UUID.generate()
    renew_token = Pow.UUID.generate()

    # Check for :secret_key first, then :password
    secret_key =
      case conn.private[:secret_key] do
        nil ->
          case Pbkdf2.generate_secret_hash(conn.private[:password]) do
            %{:secret_key => secret_key} -> secret_key
          end

        key ->
          key
      end

    encrypt_key = Pbkdf2.generate_encrypt_key_from_token(renew_token, signing_salt())
    encrypted_key = AES.encrypt(secret_key, encrypt_key)

    conn =
      conn
      |> Conn.put_private(:api_auth_token, sign_token(conn, token, config))
      |> Conn.put_private(:api_renew_token, sign_token(conn, renew_token, config))
      |> Conn.put_private(:secret_key, secret_key)

    CredentialsCache.put(
      store_config,
      token,
      {user, [secret_key: secret_key]}
    )

    PersistentSessionCache.put(
      store_config,
      renew_token,
      {[id: user.id], [encrypted_key: encrypted_key]}
    )

    {conn, user}
  end

  @impl true
  @spec delete(Conn.t(), Config.t()) :: Conn.t()
  def delete(conn, config) do
    case fetch_auth_token(conn, config) do
      nil ->
        :ok

      token ->
        config
        |> store_config()
        |> CredentialsCache.delete(token)
    end

    conn
  end

  @spec renew(Conn.t(), Config.t()) :: {Conn.t(), map() | nil}
  def renew(conn, config) do
    renew_token = fetch_auth_token(conn, config)
    store_config = store_config(config)
    res = PersistentSessionCache.get(store_config, renew_token)

    PersistentSessionCache.delete(store_config, renew_token)

    case res do
      :not_found ->
        {conn, nil}

      res ->
        conn =
          case res do
            {_clauses, [encrypted_key: encrypted_key]} ->
              encrypt_key = Pbkdf2.generate_encrypt_key_from_token(renew_token, signing_salt())
              Conn.put_private(conn, :secret_key, AES.decrypt(encrypted_key, encrypt_key))

            _ ->
              conn
          end

        load_and_create_session(conn, res, config)
    end
  end

  defp load_and_create_session(conn, {clauses, _metadata}, config) do
    case Pow.Operations.get_by(clauses, config) do
      nil -> {conn, nil}
      user -> create(conn, user, config)
    end
  end

  defp sign_token(conn, token, config) do
    Plug.sign_token(conn, signing_salt(), token, config)
  end

  defp signing_salt(), do: Atom.to_string(__MODULE__)

  defp fetch_auth_token(conn, config) do
    with [token | _rest] <- Conn.get_req_header(conn, "authorization"),
         clean_token <- String.replace_leading(token, "Bearer ", ""),
         {:ok, token} <- Plug.verify_token(conn, signing_salt(), clean_token, config) do
      token
    else
      _any -> nil
    end
  end

  defp store_config(config) do
    backend = Config.get(config, :cache_store_backend, Pow.Store.Backend.EtsCache)

    [backend: backend]
  end
end
