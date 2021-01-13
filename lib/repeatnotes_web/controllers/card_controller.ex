defmodule RepeatNotesWeb.CardController do
  use RepeatNotesWeb, :controller

  alias Ecto.Changeset
  alias RepeatNotes.Users.User
  alias RepeatNotes.Cards
  alias RepeatNotes.Cards.Card
  alias RepeatNotesWeb.ErrorHelpers

  @spec index(Plug.Conn.t(), map) :: Plug.Conn.t()
  def index(conn, params) do
    with %User{id: user_id} <- conn.assigns.current_user do
      cards = Cards.list_cards(user_id, params)
      render(conn, "index.json", cards: cards)
    end
  end

  @spec create(Plug.Conn.t(), map) :: Plug.Conn.t()
  def create(conn, %{"card" => params}) do
    with %User{id: user_id} <- conn.assigns.current_user do
      card_params = params |> Map.merge(%{"user_id" => user_id})

      case Cards.create_card(card_params) do
        {:ok, %Card{} = card} ->
          conn
          |> put_status(:created)
          |> render("create.json", card: card)

        {:error, changeset} ->
          errors = Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)

          conn
          |> put_status(400)
          |> json(%{error: %{status: 400, message: "Couldn't create card", errors: errors}})
      end
    end
  end

  @spec show(Plug.Conn.t(), map) :: Plug.Conn.t()
  def show(conn, %{"id" => id}) do
    card = Cards.get_card!(id)
    render(conn, "show.json", card: card)
  end

  @spec update(Plug.Conn.t(), map) :: Plug.Conn.t()
  def update(conn, %{"id" => id, "card" => card_params}) do
    with %User{id: user_id} <- conn.assigns.current_user do
      card = Cards.get_card!(id, user_id)

      case Cards.update_card(card, card_params) do
        {:ok, %Card{} = card} ->
          conn
          |> put_status(:ok)
          |> render("update.json", card: card)

        {:error, changeset} ->
          errors = Changeset.traverse_errors(changeset, &ErrorHelpers.translate_error/1)

          conn
          |> put_status(400)
          |> json(%{error: %{status: 400, message: "Couldn't update card", errors: errors}})
      end
    end
  end
end
