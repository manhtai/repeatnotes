defmodule RepeatNotes.Cards.Queues do
  @new 0
  @learn 1
  @review 2
  @day_learn 3
  @suspended -1
  @buried -2

  def new, do: @new
  def learn, do: @learn
  def review, do: @review
  def day_learn, do: @day_learn
  def suspended, do: @suspended
  def buried, do: @buried
end

