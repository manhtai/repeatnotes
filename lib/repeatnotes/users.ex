defmodule RepeatNotes.Users do
  @moduledoc """
  SRS setting context
  """
  import Ecto.Query

  alias RepeatNotes.Repo
  alias RepeatNotes.Users.{User, SrsConfig}

  # AUTH
  @spec send_password_reset_email(User.t()) ::
          RepeatNotes.Emails.deliver_result() | {:error, Ecto.Changeset.t()}
  def send_password_reset_email(user) do
    token = Ecto.UUID.generate()

    user
    |> User.password_reset_changeset(%{password_reset_token: token})
    |> Repo.update()
    |> case do
      {:ok, user} -> RepeatNotes.Emails.send_password_reset_email(user)
      error -> error
    end
  end

  @spec find_user_by_email(binary()) :: User.t() | nil
  def find_user_by_email(email) do
    User
    |> where(email: ^email)
    |> Repo.one()
  end

  @spec find_by_password_reset_token(binary()) :: User.t() | nil
  def find_by_password_reset_token(token) do
    User
    |> where(password_reset_token: ^token)
    |> Repo.one()
  end

  @spec update_password(User.t(), map()) :: {:ok, User.t()} | {:error, Ecto.Changeset.t()}
  def update_password(user, params) do
    updates = Map.merge(params, %{"password_reset_token" => nil})

    user
    |> User.password_changeset(updates)
    |> Repo.update()
  end

  # SRS config
  @spec get_srs_config(integer()) :: SrsConfig.t() | nil
  def get_srs_config(user_id) do
    SrsConfig
    |> where(user_id: ^user_id)
    |> Repo.one()
    |> case do
      %SrsConfig{} = config ->
        config

      nil ->
        create_srs_config(user_id)
    end
  end

  defp create_srs_config(user_id) do
    %SrsConfig{}
    |> SrsConfig.changeset(%{user_id: user_id})
    |> Repo.insert()
    |> case do
      {:ok, config} -> config
      {:serror, _reason} -> nil
    end
  end

  @spec update_srs_config(integer(), map()) ::
          {:ok, SrsConfig.t()} | {:error, Ecto.Changeset.t()}
  def update_srs_config(user_id, params) do
    get_srs_config(user_id)
    |> SrsConfig.changeset(params)
    |> Repo.update()
  end
end
