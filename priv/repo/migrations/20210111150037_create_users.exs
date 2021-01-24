defmodule RepeatNotes.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add(:id, :binary_id, primary_key: true)

      add(:email, :string, null: false)
      add(:password_hash, :string)

      add(:email_confirmation_token, :string)
      add(:email_confirmed_at, :utc_datetime)
      add(:password_reset_token, :string)

      add(:role, :string, null: false)
      add(:account_id, references(:accounts, type: :binary_id), null: false)

      timestamps()
    end

    create(unique_index(:users, [:email]))
    create(unique_index(:users, [:email_confirmation_token]))
    create(unique_index(:users, [:password_reset_token]))

    create(index(:users, [:account_id]))
  end
end
