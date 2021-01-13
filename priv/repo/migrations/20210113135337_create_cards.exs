defmodule RepeatNotes.Repo.Migrations.CreateCards do
  use Ecto.Migration

  def change do
    create table(:cards, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      add(:card_type, :integer, null: false)
      add(:card_queue, :integer, null: false)

      # SRS
      add(:due, :integer, null: false)
      add(:interval, :integer, null: false)
      add(:ease_factor, :integer, null: false)
      add(:reps, :integer, null: false)
      add(:lapses, :integer, null: false)
      add(:remaining_steps, :integer, null: false)

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

    create(index(:cards, [:card_type]))
    create(index(:cards, [:card_queue]))
    create(index(:cards, [:user_id]))
  end
end
