defmodule RepeatNotesWeb.TagController do
  use RepeatNotesWeb, :controller

  alias Ecto.Changeset
  alias RepeatNotes.Users.User
  alias RepeatNotes.Tags
  alias RepeatNotes.Tags.Tag
  alias RepeatNotesWeb.ErrorHelpers

  @limit 50

  @spec index(Plug.Conn.t(), map) :: Plug.Conn.t()
  def index(conn, params) do
    with %User{id: user_id} <- conn.assigns.current_user do
      tags = Tags.list_tags(user_id, params)
      render(conn, "index.json", tags: tags)
    end
  end

  @spec create(Plug.Conn.t(), map) :: Plug.Conn.t()
  def create(conn, %{"tag" => params}) do
    with %User{id: user_id} <- conn.assigns.current_user do
      case Tags.count_tags(user_id) do
        c when c >= @limit ->
          conn
          |> put_status(400)
          |> json(%{error: %{status: 400, message: "Tag number limit exceeded."}})

        _ ->
          tag_params =
            params
            |> Map.merge(%{"user_id" => user_id})

          case Tags.create_tag(tag_params) do
            {:ok, %Tag{} = tag} ->
              conn
              |> put_status(:created)
              |> render("create.json", tag: tag)

            {:error, changeset} ->
              errors = Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)

              conn
              |> put_status(400)
              |> json(%{error: %{status: 400, message: "Couldn't create tag", errors: errors}})
          end
      end
    end
  end

  @spec show(Plug.Conn.t(), map) :: Plug.Conn.t()
  def show(conn, %{"id" => id}) do
    with %User{id: user_id} <- conn.assigns.current_user do
      tag = Tags.get_tag!(id, user_id)
      render(conn, "show.json", tag: tag)
    end
  end

  @spec update(Plug.Conn.t(), map) :: Plug.Conn.t()
  def update(conn, %{"id" => id, "tag" => tag_params}) do
    with %User{id: user_id} <- conn.assigns.current_user do
      tag = Tags.get_tag!(id, user_id)

      case Tags.update_tag(tag, tag_params) do
        {:ok, %Tag{} = tag} ->
          conn
          |> put_status(:ok)
          |> render("update.json", tag: tag)

        {:error, changeset} ->
          errors = Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)

          conn
          |> put_status(400)
          |> json(%{error: %{status: 400, message: "Couldn't update tag", errors: errors}})
      end
    end
  end

  @spec delete(Plug.Conn.t(), map) :: Plug.Conn.t()
  def delete(conn, %{"id" => id}) do
    with %User{id: user_id} <- conn.assigns.current_user do
      tag = Tags.get_tag!(id, user_id)

      case Tags.delete_tag(tag) do
        {:ok, _} ->
          conn
          |> put_status(:no_content)
          |> json(%{})

        {:error, errors} ->
          conn
          |> put_status(400)
          |> json(%{error: %{status: 400, message: "Couldn't delete tag", errors: errors}})
      end
    end
  end
end
