defmodule RepeatNotes.Encryption.Pbkdf2Test do
  use ExUnit.Case
  alias RepeatNotes.Encryption.Pbkdf2

  test ".generate_secret_hash/1 should return different each time" do
    assert Pbkdf2.generate_secret_hash("passwd") != Pbkdf2.generate_secret_hash("passwd")
  end

  test ".generate_secret_hash/1 should be reserved by get_secret_key/1" do
    with %{:secret_key => secret_key, :secret_hash => secret_hash} =
           Pbkdf2.generate_secret_hash("passwd") do
      assert secret_key == Pbkdf2.get_secret_key("passwd", secret_hash)
      assert secret_key != Pbkdf2.get_secret_key("passwd2", secret_hash)
    end
  end
end
