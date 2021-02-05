defmodule RepeatNotes.Sm2 do
  use Rustler, otp_app: :repeatnotes, crate: "sm2"

  # When your NIF is loaded, it will override this function.
  def new(_config), do: error()
  def next_interval(_scheduler, _card, _choice), do: error()
  def answer_card(_scheduler, _card, _choice), do: error()

  defp error, do: :erlang.nif_error(:nif_not_loaded)
end
