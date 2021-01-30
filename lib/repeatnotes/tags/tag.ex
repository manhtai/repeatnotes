defmodule RepeatNotes.Tags.Tag do
  use Ecto.Schema
  import Ecto.Changeset

  alias RepeatNotes.Tags.NoteTag
  alias RepeatNotes.Users.User

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "tags" do
    field(:name, :string, null: false)

    belongs_to(:user, User, foreign_key: :user_id, references: :id, type: :binary_id)

    has_many(:note_tags, NoteTag)
    has_many(:notes, through: [:note_tags, :note])

    timestamps()
  end

  @doc false
  def changeset(tag, attrs) do
    tag
    |> cast(attrs, [:name, :user_id])
    |> validate_required([:name, :user_id])
    |> unique_constraint([:name, :user_id], name: :tags_user_id_name_index)
  end
end
