defmodule RepeatNotes.Encryption.Pbkdf2 do
  alias Pow.Ecto.Schema.Password.Pbkdf2

  @key_length 64
  @salt_length 16
  @iterations 100_000
  @digest :sha512

  def generate_secret_hash(password) do
    secret_key = :crypto.strong_rand_bytes(@key_length)
    salt = :crypto.strong_rand_bytes(@salt_length)
    derived_key = Pbkdf2.generate(password, salt, @iterations, @key_length, @digest)
    surrogate_key = :crypto.exor(secret_key, derived_key)

    %{
      :secret_key => secret_key,
      :secret_hash => encode(@digest, @iterations, salt, surrogate_key)
    }
  end

  def get_secret_key(password, secret_hash) do
    [_, _, salt, surrogate_key] = decode(secret_hash)
    derived_key = Pbkdf2.generate(password, salt, @iterations, @key_length, @digest)
    :crypto.exor(surrogate_key, derived_key)
  end

  defp encode(digest, iterations, salt, hash) do
    salt = Base.encode64(salt)
    hash = Base.encode64(hash)

    "$pbkdf2-#{digest}$#{iterations}$#{salt}$#{hash}"
  end

  defp decode(hash) do
    case String.split(hash, "$", trim: true) do
      ["pbkdf2-" <> digest, iterations, salt, hash] ->
        {:ok, salt} = Base.decode64(salt)
        {:ok, hash} = Base.decode64(hash)
        digest = String.to_existing_atom(digest)
        iterations = String.to_integer(iterations)

        [digest, iterations, salt, hash]

      _ ->
        raise ArgumentError, "not a valid encoded pbkdf2 hash"
    end
  end
end
