defmodule RepeatNotes.Cards do
  @moduledoc """
  Card context
  """
  import Ecto.Query

  alias RepeatNotes.Repo
  alias RepeatNotes.Cards.{Card, Queues}
  alias RepeatNotes.Users
  alias RepeatNotes.Utils.Timestamp

  @limit 100

  @spec due_cards(binary(), map) :: [Card.t()]
  def due_cards(user_id, params) do
    srs_config = Users.get_srs_config(user_id)

    limit = srs_config.maximum_per_session
    collapse_time = srs_config.learn_ahead_time * 60

    today =
      case params do
        %{today: today} -> today
        _ -> Timestamp.today()
      end

    now = Timestamp.now() + collapse_time

    from(c in Card,
      where:
        c.card_queue == ^Queues.new() or
          (c.card_queue == ^Queues.learn() and c.due < ^now) or
          (c.card_queue == ^Queues.review() and c.due <= ^today) or
          (c.card_queue == ^Queues.day_learn() and c.due <= ^today)
    )
    |> where(user_id: ^user_id)
    |> limit(^limit)
    |> Repo.all()
    |> Repo.preload([:note])
  end

  @spec list_cards(binary(), map) :: [Card.t()]
  def list_cards(user_id, params) do
    Card
    |> where(^filter_where(params))
    |> where(user_id: ^user_id)
    |> limit(@limit)
    |> Repo.preload([:note])
    |> Repo.all()
  end

  @spec count_cards(binary(), map) :: integer
  def count_cards(user_id, _params \\ %{}) do
    Card
    |> where(user_id: ^user_id)
    |> Repo.aggregate(:count)
  end

  @spec get_card!(binary()) :: Card.t() | nil
  def get_card!(id) do
    Card
    |> Repo.get!(id)
    |> Repo.preload([:note])
  end

  @spec get_card!(binary(), integer) :: Card.t() | nil
  def get_card!(id, user_id) do
    Card
    |> Repo.get_by!(id: id, user_id: user_id)
    |> Repo.preload([:note])
  end

  @spec create_card(map()) :: {:ok, Card.t()} | {:error, Ecto.Changeset.t()}
  def create_card(attrs \\ %{}) do
    %Card{}
    |> Card.changeset(attrs)
    |> Repo.insert()
  end

  @spec update_card(Card.t(), map()) :: {:ok, Card.t()} | {:error, Ecto.Changeset.t()}
  def update_card(%Card{} = card, attrs) do
    card
    |> Card.changeset(attrs)
    |> Repo.update()
  end

  @spec filter_where(map) :: Ecto.Query.DynamicExpr.t()
  defp filter_where(attrs) do
    Enum.reduce(attrs, dynamic(true), fn
      {"card_type", value}, dynamic ->
        dynamic([p], ^dynamic and p.card_type == ^value)

      {"card_queue", value}, dynamic ->
        dynamic([p], ^dynamic and p.card_queue == ^value)

      {_, _}, dynamic ->
        # Not a where parameter
        dynamic
    end)
  end
end
