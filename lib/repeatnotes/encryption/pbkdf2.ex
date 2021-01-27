defmodule RepeatNotes.Encryption.Pbkdf2 do
  alias Pow.Ecto.Schema.Password.Pbkdf2

  @key_length 32
  @salt_length 32
  @iterations 100_000
  @digest :sha512

  @spec generate_secret_hash(String.t()) :: map()
  def generate_secret_hash(password) do
    secret_key = :crypto.strong_rand_bytes(@key_length)
    salt = :crypto.strong_rand_bytes(@salt_length)
    derived_key = Pbkdf2.generate(password, salt, @iterations, @key_length, @digest)
    surrogate_key = :crypto.exor(secret_key, derived_key)

    %{
      :secret_key => :base64.encode(secret_key),
      :secret_hash => encode(@digest, @iterations, salt, surrogate_key)
    }
  end

  @spec generate_encrypt_key_from_token(String.t(), String.t()) :: String.t()
  def generate_encrypt_key_from_token(token, salt) do
    key = Pbkdf2.generate(token, salt, @iterations, @key_length, @digest)
    :base64.encode(key)
  end

  @spec get_secret_key(String.t(), String.t()) :: String.t()
  def get_secret_key(password, secret_hash) do
    [_, _, salt, surrogate_key] = decode(secret_hash)
    derived_key = Pbkdf2.generate(password, salt, @iterations, @key_length, @digest)
    secret_key = :crypto.exor(surrogate_key, derived_key)
    :base64.encode(secret_key)
  end

  defp encode(digest, iterations, salt, hash) do
    salt = :base64.encode(salt)
    hash = :base64.encode(hash)

    "$pbkdf2-#{digest}$#{iterations}$#{salt}$#{hash}"
  end

  defp decode(hash) do
    case String.split(hash, "$", trim: true) do
      ["pbkdf2-" <> digest, iterations, salt, hash] ->
        salt = :base64.decode(salt)
        hash = :base64.decode(hash)
        digest = String.to_existing_atom(digest)
        iterations = String.to_integer(iterations)

        [digest, iterations, salt, hash]

      _ ->
        raise ArgumentError, "not a valid encoded pbkdf2 hash"
    end
  end
end
