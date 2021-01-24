defmodule RepeatNotes.Notes do
  import Ecto.Query

  alias RepeatNotes.Repo
  alias RepeatNotes.Notes.Note

  @max_return 200

  @spec list_notes(binary(), map) :: [Note.t()]
  def list_notes(user_id, _params) do
    Note
    |> where(user_id: ^user_id)
    |> order_by(desc: :inserted_at)
    |> limit(@max_return)
    |> Repo.all()
  end

  @spec get_note!(binary()) :: Note.t() | nil
  def get_note!(id) do
    Note
    |> Repo.get!(id)
  end

  @spec get_note!(binary(), integer) :: Note.t() | nil
  def get_note!(id, user_id) do
    Note
    |> Repo.get_by!(id: id, user_id: user_id)
  end

  @spec create_note(map()) :: {:ok, Note.t()} | {:error, Ecto.Changeset.t()}
  def create_note(attrs \\ %{}) do
    %Note{}
    |> Note.changeset(attrs)
    |> Repo.insert()
  end

  @spec update_note(Note.t(), map()) :: {:ok, Note.t()} | {:error, Ecto.Changeset.t()}
  def update_note(%Note{} = note, attrs) do
    note
    |> Note.changeset(attrs)
    |> Repo.update()
  end
end