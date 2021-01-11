defmodule RepeatNotes.Users.User do
  @moduledoc """
  User model
  """

  use Ecto.Schema
  use Pow.Ecto.Schema
  import Ecto.Changeset

  alias RepeatNotes.Accounts.Account
  alias RepeatNotes.Users.Roles

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field(:password_reset_token, :string)
    field(:email_confirmation_token, :string)
    field(:email_confirmed_at, :utc_datetime)

    field(:role, :string, default: Roles.member())
    belongs_to(:account, Account, type: :binary_id)

    pow_user_fields()

    timestamps()
  end

  def changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> pow_changeset(attrs)
    |> cast(attrs, [:account_id, :role])
    |> validate_required([:account_id])
  end

  @spec role_changeset(Ecto.Schema.t() | Ecto.Changeset.t(), map()) :: Ecto.Changeset.t()
  def role_changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> cast(attrs, [:role])
    |> validate_inclusion(:role, [Roles.member(), Roles.admin()])
  end

  @spec email_verification_changeset(Ecto.Schema.t() | Ecto.Changeset.t(), map()) ::
          Ecto.Changeset.t()
  def email_verification_changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> cast(attrs, [:email_confirmation_token, :email_confirmed_at])
    |> validate_required([])
  end

  @spec password_reset_changeset(Ecto.Schema.t() | Ecto.Changeset.t(), map()) ::
          Ecto.Changeset.t()
  def password_reset_changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> cast(attrs, [:password_reset_token])
    |> validate_required([])
  end

  @spec password_changeset(Ecto.Schema.t() | Ecto.Changeset.t(), map()) ::
          Ecto.Changeset.t()
  def password_changeset(user_or_changeset, attrs) do
    user_or_changeset
    |> pow_password_changeset(attrs)
    |> password_reset_changeset(attrs)
  end
end
