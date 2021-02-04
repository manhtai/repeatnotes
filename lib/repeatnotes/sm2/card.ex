defmodule RepeatNotes.Sm2.Card do
  defstruct card_type: :new,
            card_queue: :new,
            due: 0,
            interval: 0,
            ease_factor: 0,
            reps: 0,
            lapses: 0,
            remaining_steps: 0
end
