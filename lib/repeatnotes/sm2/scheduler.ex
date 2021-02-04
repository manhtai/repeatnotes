defmodule RepeatNotes.Sm2.Scheduler do
  alias RepeatNotes.Sm2.Config

  defstruct config: %Config{},
            day_cut_off: 0,
            day_today: 0
end
