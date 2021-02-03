defmodule RepeatNotes.Sm2 do
  use Rustler, otp_app: :repeatnotes, crate: "sm2"

  # When your NIF is loaded, it will override this function.
  def add(_a, _b), do: :erlang.nif_error(:nif_not_loaded)
end
