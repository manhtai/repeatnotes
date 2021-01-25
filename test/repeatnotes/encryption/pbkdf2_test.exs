defmodule RepeatNotes.Encryption.Pbkdf2Test do
  use ExUnit.Case
  alias RepeatNotes.Encryption.Pbkdf2

  test ".generate_surrogate_key/1 should return different each time" do
    assert Pbkdf2.generate_surrogate_key("passwd") != Pbkdf2.generate_surrogate_key("passwd")
  end

  test ".generate_surrogate_key/1 should be reserved" do
    with [secret_key, salt, surrogate_key] = Pbkdf2.generate_surrogate_key("passwd") do
      assert secret_key == Pbkdf2.recover_secret_key("passwd", salt, surrogate_key)
      assert secret_key != Pbkdf2.recover_secret_key("passwd2", salt, surrogate_key)
    end
  end
end
