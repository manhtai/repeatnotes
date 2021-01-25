defmodule RepeatNotesWeb.RegistrationController do
  use RepeatNotesWeb, :controller
  alias Ecto.Changeset
  alias RepeatNotesWeb.ErrorHelpers

  alias RepeatNotes.{Accounts, Users.Roles}

  alias Plug.Conn

  @spec create(Conn.t(), map()) :: Conn.t()
  def create(conn, params)

  def create(conn, %{"user" => user_params}) do
    if registration_disabled?() do
      send_server_error(conn, 403, "Registration is disabled")
    else
      conn
      |> user_with_account_transaction(user_params)
      |> RepeatNotes.Repo.transaction()
      |> case do
        {:ok, %{conn: conn}} ->
          conn |> send_api_token()

        {:error, _op, changeset, _changes} ->
          errors = Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)
          send_user_create_errors(conn, errors)
      end
    end
  end

  @spec user_with_account_transaction(Conn.t(), map()) :: Ecto.Multi.t()
  def user_with_account_transaction(conn, params) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:account, fn _repo, %{} ->
      # Default to user email
      Accounts.create_account(%{name: params["email"]})
    end)
    |> Ecto.Multi.run(:conn, fn _repo, %{account: account} ->
      # Default to admin role
      user =
        Enum.into(params, %{
          "account_id" => account.id,
          "role" => Roles.admin()
        })

      case Pow.Plug.create_user(conn, user) do
        {:ok, _user, conn} ->
          {:ok, conn}

        {:error, reason, _conn} ->
          {:error, reason}
      end
    end)
  end

  defp send_api_token(conn) do
    json(conn, %{
      data: %{
        token: conn.private[:api_auth_token],
        renew_token: conn.private[:api_renew_token]
      }
    })
  end

  defp send_user_create_errors(conn, errors) do
    conn
    |> put_status(400)
    |> json(%{error: %{status: 400, message: "Couldn't create user", errors: errors}})
  end

  defp send_server_error(conn, status_code, message) do
    conn
    |> put_status(status_code)
    |> json(%{error: %{status: status_code, message: message}})
  end

  @spec registration_disabled?() :: boolean()
  defp registration_disabled?() do
    case System.get_env("REPEATNOTES_REGISTRATION_DISABLED") do
      x when x == "1" or x == "true" -> true
      _ -> false
    end
  end
end
