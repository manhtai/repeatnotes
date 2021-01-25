defmodule RepeatNotes.Encryption.AESTest do
  use ExUnit.Case
  alias RepeatNotes.Encryption.AES

  test ".encrypt includes the random IV in the value" do
    <<iv::binary-16, ciphertext::binary>> = AES.encrypt("hello", get_key())

    assert String.length(iv) != 0
    assert String.length(ciphertext) != 0
    assert is_binary(ciphertext)
  end

  test ".encrypt does not produce the same ciphertext twice" do
    assert AES.encrypt("hello", get_key()) != AES.encrypt("hello", get_key())
  end

  test ".decrypt/1 ciphertext that was encrypted with default key" do
    plaintext = "hello" |> AES.encrypt(get_key()) |> AES.decrypt(get_key())
    assert plaintext == "hello"
  end

  test ".decrypt/1 ciphertext that was encrypted with different key" do
    plaintext = "hello" |> AES.encrypt(get_key()) |> AES.decrypt(get_key_2())
    assert plaintext != "hello"
  end

  defp get_key do
    <<109, 182, 30, 109, 203, 207, 35, 144, 228, 164, 106, 244, 38, 242, 106, 19, 58, 59, 238, 69,
      2, 20, 34, 252, 122, 232, 110, 145, 54, 241, 65, 16>>
  end

  defp get_key_2 do
    <<109, 183, 30, 109, 203, 207, 35, 144, 228, 164, 106, 244, 38, 242, 106, 19, 58, 59, 238, 69,
      2, 20, 34, 252, 122, 232, 110, 145, 54, 241, 65, 16>>
  end
end
