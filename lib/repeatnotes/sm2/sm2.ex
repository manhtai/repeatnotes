defmodule RepeatNotes.Sm2 do
  use Rustler, otp_app: :repeatnotes, crate: "sm2"

  # When your NIF is loaded, it will override this function.
  def new(_config), do: error()

  def next_interval(_scheduler, _card, _choice), do: error()
  def next_interval_string(_scheduler, _card, _choice), do: error()

  def answer_card(_scheduler, _card, _choice), do: error()

  def bury_card(_scheduler, _card), do: error()
  def unbury_card(_scheduler, _card), do: error()
  def suspend_card(_scheduler, _card), do: error()
  def unsuspend_card(_scheduler, _card), do: error()
  def schedule_card_as_new(_scheduler, _card), do: error()
  def schedule_card_as_review(_scheduler, _card, _min_days, _max_days), do: error()

  defp error, do: :erlang.nif_error(:nif_not_loaded)
end
