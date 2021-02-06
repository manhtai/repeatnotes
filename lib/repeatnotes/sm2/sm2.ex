defmodule RepeatNotes.Sm2 do
  use Rustler, otp_app: :repeatnotes, crate: "sm2"
  alias RepeatNotes.Sm2.{Config, Scheduler}

  # When your NIF is loaded, it will override this function.
  @spec new(Config.t()) :: Scheduler.t()
  def new(_config), do: error()

  def next_interval(_card, _scheduler, _choice), do: error()
  def next_interval_string(_card, _scheduler, _choice), do: error()

  def answer_card(_card, _scheduler, _choice), do: error()

  def bury_card(_card, _scheduler), do: error()
  def unbury_card(_card, _scheduler), do: error()
  def suspend_card(_card, _scheduler), do: error()
  def unsuspend_card(_card, _scheduler), do: error()
  def schedule_card_as_new(_card, _scheduler), do: error()
  def schedule_card_as_review(_card, _scheduler, _min_days, _max_days), do: error()

  defp error, do: :erlang.nif_error(:nif_not_loaded)
end
