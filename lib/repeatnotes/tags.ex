defmodule RepeatNotes.Tags do
  @moduledoc """
  Tag context
  """
  import Ecto.Query

  alias RepeatNotes.Repo
  alias RepeatNotes.Tags.{Tag}

  @limit 50

  @spec list_tags(binary(), map) :: [Card.t()]
  def list_tags(user_id, params) do
    Tag
    |> where(user_id: ^user_id)
    |> where(^filter_where(params))
    |> order_by(asc: :name)
    |> limit(@limit)
    |> Repo.all()
  end

  @spec count_tags(binary(), map) :: integer
  def count_tags(user_id, params \\ %{}) do
    Tag
    |> where(^filter_where(params))
    |> where(user_id: ^user_id)
    |> limit(@limit)
    |> Repo.aggregate(:count)
  end

  @spec get_tag!(binary()) :: Card.t() | nil
  def get_tag!(id) do
    Tag
    |> Repo.get_by!(id: id)
  end

  @spec get_tag!(binary(), binary()) :: Card.t() | nil
  def get_tag!(id, user_id) do
    Tag
    |> Repo.get_by!(id: id, user_id: user_id)
  end

  @spec create_tag(map) :: {:ok, Tag.t()} | {:error, Ecto.Changeset.t()}
  def create_tag(attrs \\ %{}) do
    %Tag{}
    |> Tag.changeset(attrs)
    |> Repo.insert()
  end

  @spec update_tag(Tag.t(), map()) :: {:ok, Tag.t()} | {:error, Ecto.Changeset.t()}
  def update_tag(%Tag{} = tag, attrs) do
    tag
    |> Tag.changeset(attrs)
    |> Repo.update()
  end

  @spec delete_tag(Tag.t()) :: {:ok, Tag.t()} | {:error, Ecto.Changeset.t()}
  def delete_tag(%Tag{} = tag) do
    tag
    |> Repo.delete()
  end

  @spec filter_where(map) :: Ecto.Query.DynamicExpr.t()
  defp filter_where(attrs) do
    Enum.reduce(attrs, dynamic(true), fn
      {"name", value}, dynamic ->
        dynamic([t], ^dynamic and ilike(t.name, ^"%#{value}%"))

      {_, _}, dynamic ->
        # Not a where parameter
        dynamic
    end)
  end
end
