defmodule RepeatNotes.Cards.Card do
  use Ecto.Schema
  import Ecto.Changeset
  alias RepeatNotes.Users.User
  alias RepeatNotes.Cards.{Types, Queues}

  @srs_fields [
    :card_type,
    :card_queue,
    :due,
    :interval,
    :ease_factor,
    :reps,
    :lapses,
    :remaining_steps
  ]
  @required_fields [:user_id]

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "cards" do
    # SRS fields
    field(:card_type, :integer, default: Types.new())
    field(:card_queue, :integer, default: Queues.new())
    field(:due, :integer, default: 0)
    field(:interval, :integer, default: 0)
    field(:ease_factor, :integer, default: 0)
    field(:reps, :integer, default: 0)
    field(:lapses, :integer, default: 0)
    field(:remaining_steps, :integer, default: 0)

    belongs_to(:user, User, foreign_key: :user_id, references: :id, type: :binary_id)

    timestamps()
  end

  def changeset(card, attrs) do
    card
    |> cast(attrs, @srs_fields ++ @required_fields)
    |> validate_required(@required_fields)
  end
end
