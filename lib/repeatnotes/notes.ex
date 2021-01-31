defmodule RepeatNotes.Notes do
  import Ecto.Query

  alias RepeatNotes.Repo
  alias RepeatNotes.Notes.Note
  alias RepeatNotes.Tags.NoteTag
  alias RepeatNotes.Encryption.AES

  @max_return 100
  @random_return 10

  @spec list_notes(binary(), map) :: [Note.t()]
  def list_notes(user_id, params) do
    Note
    |> where(user_id: ^user_id)
    |> where(^filter_where(params))
    |> order_by(desc: :inserted_at)
    |> limit(@max_return)
    |> Repo.all()
    |> Repo.preload([:tags])
  end

  @spec random_notes(binary()) :: [Note.t()]
  def random_notes(user_id) do
    Note
    |> where(user_id: ^user_id)
    |> order_by(fragment("RANDOM()"))
    |> limit(@random_return)
    |> Repo.all()
    |> Repo.preload([:tags])
  end

  @spec list_notes_by_tag(binary(), binary()) :: [Note.t()]
  def list_notes_by_tag(user_id, tag_id) do
    from(
      note_tag in NoteTag,
      where: note_tag.user_id == ^user_id and note_tag.tag_id == ^tag_id,
      inner_join: note in Note,
      on: note.id == note_tag.note_id,
      select: note
    )
    |> limit(@max_return)
    |> Repo.all()
    |> Repo.preload([:tags])
  end

  @spec get_note!(binary()) :: Note.t() | nil
  def get_note!(id) do
    Note
    |> Repo.get!(id)
    |> Repo.preload([:tags])
  end

  @spec get_note!(binary(), binary()) :: Note.t() | nil
  def get_note!(id, user_id) do
    Note
    |> Repo.get_by!(id: id, user_id: user_id)
    |> Repo.preload([:tags])
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

  @spec patch_note(Note.t(), map()) :: {:ok, Note.t()} | {:error, Ecto.Changeset.t()}
  def patch_note(%Note{} = note, attrs) do
    note
    |> Note.changeset_patch(attrs)
    |> Repo.update()
  end

  @spec delete_note(Note.t()) :: {:ok, Note.t()} | {:error, Ecto.Changeset.t()}
  def delete_note(%Note{} = note) do
    note
    |> Repo.delete()
  end

  @spec encrypt_note_content(map, String.t()) :: map()
  def encrypt_note_content(note, secret_key) do
    content = AES.encrypt(note["content"], secret_key)
    note |> Map.merge(%{"content" => content})
  end

  @spec get_note_tag(Note.t(), binary()) :: nil | NoteTag.t()
  def get_note_tag(%Note{id: id} = _note, tag_id) do
    NoteTag
    |> where(note_id: ^id, tag_id: ^tag_id)
    |> Repo.one()
  end

  @spec add_tag(Note.t(), binary()) :: {:ok, NoteTag.t()} | {:error, Ecto.Changeset.t()}
  def add_tag(%Note{id: id} = note, tag_id) do
    case get_note_tag(note, tag_id) do
      nil ->
        %NoteTag{}
        |> NoteTag.changeset(%{
          note_id: id,
          tag_id: tag_id,
          user_id: note.user_id
        })
        |> Repo.insert()

      tag ->
        {:ok, tag}
    end
  end

  @spec remove_tag(Note.t(), binary()) :: {:ok, NoteTag.t()} | {:error, Ecto.Changeset.t()}
  def remove_tag(%Note{} = note, tag_id) do
    note
    |> get_note_tag(tag_id)
    |> Repo.delete()
  end

  @spec decrypt_notes_content([Note.t()], String.t()) :: [Note.t()]
  def decrypt_notes_content(notes, secret_key) do
    notes
    |> Enum.map(fn note ->
      content = AES.decrypt(note.content, secret_key)
      struct(note, %{content: content})
    end)
  end

  @spec decrypt_note_content(Note.t(), String.t()) :: Note.t()
  def decrypt_note_content(note, secret_key) do
    content = AES.decrypt(note.content, secret_key)
    struct(note, %{content: content})
  end

  @spec filter_where(map) :: Ecto.Query.DynamicExpr.t()
  defp filter_where(attrs) do
    Enum.reduce(attrs, dynamic(true), fn
      {"trash", value}, dynamic ->
        dynamic([n], ^dynamic and n.trash == ^value)

      {"archive", value}, dynamic ->
        dynamic([n], ^dynamic and n.archive == ^value)

      {"pin", value}, dynamic ->
        dynamic([n], ^dynamic and n.pin == ^value)

      {_, _}, dynamic ->
        # Not a where parameter
        dynamic
    end)
  end
end
