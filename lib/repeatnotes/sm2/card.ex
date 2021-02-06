defmodule RepeatNotes.Sm2.Card do
  defstruct card_type: :new,
            card_queue: :new,
            due: 0,
            interval: 0,
            ease_factor: 0,
            reps: 0,
            lapses: 0,
            remaining_steps: 0

  def from_ecto_card(ecto_card) do
    card_map = Map.from_struct(ecto_card)

    card_map =
      card_map
      |> Map.merge(%{
        card_type: RepeatNotes.Cards.Types.to_atom(card_map.card_type),
        card_queue: RepeatNotes.Cards.Queues.to_atom(card_map.card_queue)
      })

    struct(RepeatNotes.Sm2.Card, card_map)
  end

  def to_ecto_card(sm2_card) do
    card_map = Map.from_struct(sm2_card)

    card_map =
      card_map
      |> Map.merge(%{
        card_type: RepeatNotes.Cards.Types.from_atom(card_map.card_type),
        card_queue: RepeatNotes.Cards.Queues.from_atom(card_map.card_queue)
      })

    struct(RepeatNotes.Cards.Card, card_map)
  end
end
