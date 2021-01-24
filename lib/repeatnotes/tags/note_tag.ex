defmodule RepeatNotes.Tags.NoteTag do
  use Ecto.Schema
  import Ecto.Changeset

  alias RepeatNotes.{Tags.Tag, Users.User, Notes.Note}

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "note_tags" do
    belongs_to(:tag, Tag)
    belongs_to(:note, Note)
    belongs_to(:user, User, foreign_key: :user_id, references: :id, type: :binary_id)

    timestamps()
  end

  @doc false
  def changeset(schema, attrs) do
    schema
    |> cast(attrs, [:note_id, :tag_id, :user_id])
    |> validate_required([:note_id, :tag_id, :user_id])
  end
end
