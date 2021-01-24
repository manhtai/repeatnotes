defmodule RepeatNotesWeb.CardView do
  use RepeatNotesWeb, :view
  alias RepeatNotesWeb.{CardView, NoteView}

  def render("index.json", %{cards: cards}) do
    %{data: render_many(cards, CardView, "expanded.json")}
  end

  def render("create.json", %{card: card}) do
    %{data: render_one(card, CardView, "expanded.json")}
  end

  def render("update.json", %{card: card}) do
    %{data: render_one(card, CardView, "expanded.json")}
  end

  def render("show.json", %{card: card}) do
    %{data: render_one(card, CardView, "expanded.json")}
  end

  def render("basic.json", %{card: card}) do
    %{
      id: card.id,
      card_type: card.card_type,
      card_queue: card.card_queue,
      due: card.due,
      created_at: card.inserted_at,
      updated_at: card.updated_at
    }
  end

  def render("expanded.json", %{card: card}) do
    %{
      id: card.id,
      card_type: card.card_type,
      card_queue: card.card_queue,
      due: card.due,
      interval: card.interval,
      ease_factor: card.ease_factor,
      reps: card.reps,
      lapses: card.lapses,
      remaining_steps: card.remaining_steps,
      created_at: card.inserted_at,
      updated_at: card.updated_at,
      note: render_one(card.note, NoteView, "expanded.json")
    }
  end
end
