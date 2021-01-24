defmodule RepeatNotes.Emails do
  alias RepeatNotes.Emails.Email

  @type deliver_result() :: {:ok, term()} | {:error, binary()} | {:warning, binary()}

  @spec send_password_reset_email(User.t()) :: deliver_result()
  def send_password_reset_email(user) do
    user
    |> Email.password_reset()
    |> deliver()
  end

  @spec has_valid_to_addresses?(Email.t()) :: boolean()
  def has_valid_to_addresses?(email) do
    Enum.all?(email.to, fn {_name, address} ->
      RepeatNotes.Emails.Utils.valid?(address)
    end)
  end

  @spec deliver(Email.t()) :: deliver_result()
  def deliver(email) do
    try do
      if has_valid_to_addresses?(email) do
        RepeatNotes.Mailers.Sendinblue.deliver(email)
      else
        {:warning, "Skipped sending to potential invalid email: #{inspect(email.to)}"}
      end
    rescue
      e ->
        IO.puts("Send email error: #{e.message}")
        {:error, e.message}
    end
  end
end
