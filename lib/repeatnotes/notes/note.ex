defmodule RepeatNotes.Notes.Note do
  use Ecto.Schema
  import Ecto.Changeset
  alias RepeatNotes.{Users.User, Cards.Card, Tags.NoteTag}

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "notes" do
    field(:content, :string, default: "")

    belongs_to(:user, User, foreign_key: :user_id, references: :id, type: :binary_id)

    has_many(:cards, Card)

    has_many(:note_tags, NoteTag)
    has_many(:tags, through: [:note_tags, :tag])

    timestamps()
  end

  def changeset(note, attrs) do
    note
    |> cast(attrs, [:content, :user_id])
    |> validate_required([:user_id])
  end
end
