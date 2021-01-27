defmodule RepeatNotes.Encryption.AES do
  # Use AES 256 Bit Keys for Encryption.
  @aad "AES256GCM"

  # Return cipher text in base64
  @spec encrypt(String.t(), String.t()) :: String.t()
  def encrypt(plaintext, key) do
    key = :base64.decode(key)
    # create random Initialisation Vector
    iv = :crypto.strong_rand_bytes(16)
    {ciphertext, tag} = :crypto.block_encrypt(:aes_gcm, key, iv, {@aad, to_string(plaintext), 16})
    # "return" iv with the cipher tag & ciphertext
    :base64.encode(iv <> tag <> ciphertext)
  end

  # Return plain text
  @spec decrypt(String.t(), String.t()) :: String.t()
  def decrypt(ciphertext, key) do
    ciphertext = :base64.decode(ciphertext)
    key = :base64.decode(key)
    <<iv::binary-16, tag::binary-16, ciphertext::binary>> = ciphertext
    :crypto.block_decrypt(:aes_gcm, key, iv, {@aad, ciphertext, tag})
  end

  @spec encrypt(any) :: String.t()
  def encrypt(plaintext) do
    encrypt(plaintext, get_key())
  end

  @spec decrypt(any) :: String.t()
  def decrypt(ciphertext) do
    decrypt(ciphertext, get_key())
  end

  @spec get_key() :: String.t()
  defp get_key do
    get_key_id() |> get_key
  end

  @spec get_key(number) :: String.t()
  defp get_key(key_id) do
    encryption_keys() |> Enum.at(key_id)
  end

  @spec get_key_id() :: integer()
  defp get_key_id do
    Enum.count(encryption_keys()) - 1
  end

  @spec encryption_keys() :: list(String.t())
  defp encryption_keys do
    Application.get_env(:repeatnotes, Encryption.AES)[:keys]
  end
end
