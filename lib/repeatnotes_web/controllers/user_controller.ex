defmodule RepeatNotesWeb.UserController do
  use RepeatNotesWeb, :controller
  alias RepeatNotes.Users

  @spec create_password_reset(Plug.Conn.t(), map) :: Plug.Conn.t()
  def create_password_reset(conn, %{"email" => email}) do
    case Users.find_user_by_email(email) do
      nil ->
        json(conn, %{data: %{ok: true}})

      user ->
        case Users.send_password_reset_email(user) do
          {:ok, _} ->
            json(conn, %{data: %{ok: true}})

          {:warning, _} ->
            json(conn, %{data: %{ok: true}})

          _ ->
            json(conn, %{data: %{ok: false}})
        end
    end
  end

  @spec reset_password(Plug.Conn.t(), map) :: Plug.Conn.t()
  def reset_password(conn, %{"token" => token} = params) do
    case Users.find_by_password_reset_token(token) do
      nil ->
        conn
        |> put_status(401)
        |> json(%{error: %{status: 401, message: "Invalid token"}})

      user ->
        case Users.update_password(user, params) do
          {:ok, user} -> json(conn, %{data: %{success: true, email: user.email}})
          {:error, reason} -> json(conn, %{data: %{success: false, message: reason}})
        end
    end
  end
end
