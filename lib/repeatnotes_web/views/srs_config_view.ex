defmodule RepeatNotesWeb.SrsConfigView do
  use RepeatNotesWeb, :view
  alias RepeatNotesWeb.SrsConfigView

  def render("index.json", %{srs_config: srs_config}) do
    %{data: render_many(srs_config, SrsConfigView, "srs_config.json")}
  end

  def render("show.json", %{srs_config: srs_config}) do
    %{data: render_one(srs_config, SrsConfigView, "srs_config.json")}
  end

  def render("srs_config.json", %{srs_config: config}) do
    %{
      id: config.id,
      maximum_per_session: config.maximum_per_session,
      learn_ahead_time: config.learn_ahead_time,
      show_next_due: config.show_next_due,
      learn_steps: config.learn_steps,
      relearn_steps: config.relearn_steps,
      initial_ease: config.initial_ease,
      easy_multiplier: config.easy_multiplier,
      hard_multiplier: config.hard_multiplier,
      lapse_multiplier: config.lapse_multiplier,
      interval_multiplier: config.interval_multiplier,
      maximum_review_interval: config.maximum_review_interval,
      minimum_review_interval: config.minimum_review_interval,
      graduating_interval_good: config.graduating_interval_good,
      graduating_interval_easy: config.graduating_interval_easy,
      leech_threshold: config.leech_threshold
    }
  end
end
