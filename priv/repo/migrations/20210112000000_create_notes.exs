defmodule RepeatNotes.Repo.Migrations.CreateNotes do
  use Ecto.Migration

  def change do
    create table(:notes, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      add(:content, :text, null: false)

      add(:color, :string, null: false)
      add(:pin, :boolean, null: false)
      add(:archive, :boolean, null: false)
      add(:trash, :boolean, null: false)

      add(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all,
          type: :binary_id
        ),
        null: false
      )

      timestamps()
    end

    create(index(:notes, [:user_id]))
  end
end
