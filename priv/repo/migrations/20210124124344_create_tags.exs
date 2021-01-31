defmodule RepeatNotes.Repo.Migrations.CreateTags do
  use Ecto.Migration

  def change do
    # Tags
    create table(:tags, primary_key: false) do
      add(:id, :binary_id, primary_key: true)
      add(:name, :string, null: false)

      add(:user_id, references(:users, type: :binary_id))

      timestamps()
    end

    create(index(:tags, [:name]))
    create(index(:tags, [:user_id]))
    create(unique_index(:tags, [:user_id, :name]))

    # Note tags
    create table(:note_tags, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      add(:note_id, references(:notes, type: :binary_id, on_delete: :delete_all))
      add(:tag_id, references(:tags, type: :binary_id, on_delete: :delete_all))
      add(:user_id, references(:users, type: :binary_id))

      timestamps()
    end

    create(unique_index(:note_tags, [:user_id, :note_id, :tag_id]))
    create(index(:note_tags, [:user_id]))
    create(index(:note_tags, [:note_id]))
    create(index(:note_tags, [:tag_id]))
  end
end
