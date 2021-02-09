defmodule RepeatNotesWeb.NoteView do
  use RepeatNotesWeb, :view
  alias RepeatNotesWeb.{NoteView, TagView, CardView}

  def render("index.json", %{notes: notes}) do
    %{data: render_many(notes, NoteView, "full.json")}
  end

  def render("create.json", %{note: note}) do
    %{data: render_one(note, NoteView, "basic.json")}
  end

  def render("update.json", %{note: note}) do
    %{data: render_one(note, NoteView, "basic.json")}
  end

  def render("show.json", %{note: note}) do
    %{data: render_one(note, NoteView, "full.json")}
  end

  def render("basic.json", %{note: note}) do
    %{
      id: note.id,
      content: note.content
    }
  end

  def render("expanded.json", %{note: note}) do
    %{
      id: note.id,
      inserted_at: note.inserted_at,
      content: note.content
    }
  end

  def render("full.json", %{note: note}) do
    [card] = note.cards

    %{
      id: note.id,
      inserted_at: note.inserted_at,
      updated_at: note.updated_at,
      content: note.content,
      pin: note.pin,
      archive: note.archive,
      trash: note.trash,
      tags: render_many(note.tags, TagView, "basic.json"),
      card: render_one(card, CardView, "basic.json")
    }
  end
end
