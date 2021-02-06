defmodule RepeatNotes.Srs do
  alias RepeatNotes.EtsCache

  alias RepeatNotes.Sm2
  alias RepeatNotes.Users

  def get_scheduler(user_id) do
    cache_key = get_cache_key(user_id)
    EtsCache.read_or_cache_default(cache_key, fn -> get_scheduler_from_db(user_id) end)
  end

  defp get_cache_key(user_id) do
    "scheduler_" <> user_id
  end

  def get_scheduler_from_db(user_id) do
    srs_config = Users.get_srs_config(user_id)
    sm2_config = struct(Sm2.Config, Map.from_struct(srs_config))
    Sm2.new(sm2_config)
  end
end
