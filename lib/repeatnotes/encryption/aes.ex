defmodule RepeatNotes.Encryption.AES do
  # Use AES 256 Bit Keys for Encryption.
  @aad "AES256GCM"

  def encrypt(plaintext, key) do
    # create random Initialisation Vector
    iv = :crypto.strong_rand_bytes(16)
    {ciphertext, tag} = :crypto.block_encrypt(:aes_gcm, key, iv, {@aad, to_string(plaintext), 16})
    # "return" iv with the cipher tag & ciphertext
    iv <> tag <> ciphertext
  end

  def decrypt(ciphertext, key) do
    <<iv::binary-16, tag::binary-16, ciphertext::binary>> = ciphertext
    :crypto.block_decrypt(:aes_gcm, key, iv, {@aad, ciphertext, tag})
  end
end
