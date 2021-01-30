defmodule RepeatNotesWeb.TagView do
  use RepeatNotesWeb, :view
  alias RepeatNotesWeb.TagView

  def render("index.json", %{tags: tags}) do
    %{data: render_many(tags, TagView, "basic.json")}
  end

  def render("create.json", %{tag: tag}) do
    %{data: render_one(tag, TagView, "expanded.json")}
  end

  def render("update.json", %{tag: tag}) do
    %{data: render_one(tag, TagView, "expanded.json")}
  end

  def render("show.json", %{tag: tag}) do
    %{data: render_one(tag, TagView, "expanded.json")}
  end

  def render("basic.json", %{tag: tag}) do
    %{
      id: tag.id,
      name: tag.name
    }
  end

  def render("expanded.json", %{tag: tag}) do
    %{
      id: tag.id,
      name: tag.name,
      created_at: tag.inserted_at,
      updated_at: tag.updated_at
    }
  end
end
