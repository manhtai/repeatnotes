defmodule RepeatNotes.Cards.Types do
  @new 0
  @learn 1
  @review 2
  @relearn 3

  def new, do: @new
  def learn, do: @learn
  def review, do: @review
  def relearn, do: @relearn
end
