defmodule RepeatNotesWeb.SessionController do
  use RepeatNotesWeb, :controller

  alias RepeatNotesWeb.APIAuthPlug
  alias RepeatNotes.{Encryption.Pbkdf2, Encryption.AES}
  alias Plug.Conn

  @spec create(Conn.t(), map()) :: Conn.t()
  def create(conn, %{"user" => user_params}) do
    conn
    |> Pow.Plug.authenticate_user(user_params)
    |> case do
      {:ok, conn} ->
        with secret_key =
               Pbkdf2.get_secret_key(
                 user_params["password"],
                 conn.assigns.current_user.secret_hash
               ) do
          json(conn, %{
            data: %{
              user_id: conn.assigns.current_user.id,
              email: conn.assigns.current_user.email,
              token: conn.private[:api_auth_token],
              renew_token: conn.private[:api_renew_token],
              encrypted_key: AES.encrypt(secret_key)
            }
          })
        end

      {:error, conn} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid email or password"}})
    end
  end

  @spec renew(Conn.t(), map()) :: Conn.t()
  def renew(conn, %{"data" => params}) do
    config = Pow.Plug.fetch_config(conn)

    encrypted_key =
      case params do
        %{"encrypted_key" => encrypted_key} -> AES.encrypt(AES.decrypt(encrypted_key))
        _ -> ''
      end

    conn
    |> APIAuthPlug.renew(config)
    |> case do
      {conn, nil} ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})

      {conn, user} ->
        json(conn, %{
          data: %{
            user_id: user.id,
            email: user.email,
            token: conn.private[:api_auth_token],
            renew_token: conn.private[:api_renew_token],
            encrypted_key: encrypted_key
          }
        })
    end
  end

  @spec delete(Conn.t(), map()) :: Conn.t()
  def delete(conn, _params) do
    conn
    |> Pow.Plug.delete()
    |> json(%{data: %{}})
  end

  @spec me(Conn.t(), map()) :: Conn.t()
  def me(conn, _params) do
    case conn.assigns.current_user do
      %{id: id, email: email, inserted_at: inserted_at} ->
        json(conn, %{
          data: %{
            id: id,
            email: email,
            inserted_at: inserted_at
          }
        })

      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})
    end
  end
end
