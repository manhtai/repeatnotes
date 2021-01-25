defmodule RepeatNotes.Encryption.Pbkdf2 do
  alias Pow.Ecto.Schema.Password.Pbkdf2

  @key_length 64
  @salt_length 16
  @iterations 100_000
  @digest :sha512

  def generate_surrogate_key(password) do
    secret_key = :crypto.strong_rand_bytes(@key_length)
    salt = :crypto.strong_rand_bytes(@salt_length)
    derived_key = Pbkdf2.generate(password, salt, @iterations, @key_length, @digest)
    surrogate_key = :crypto.exor(secret_key, derived_key)
    [secret_key, salt, surrogate_key]
  end

  def recover_secret_key(password, salt, surrogate_key) do
    derived_key = Pbkdf2.generate(password, salt, @iterations, @key_length, @digest)
    :crypto.exor(surrogate_key, derived_key)
  end
end
