defmodule RepeatNotes.Sm2.Sm2Test do
  use ExUnit.Case

  alias RepeatNotes.Sm2
  alias RepeatNotes.Sm2.{Config, Card}

  test "next interval" do
    scheduler = Sm2.new(%Config{})
    assert Sm2.next_interval(%Card{}, scheduler, :again) > 0
  end

  test "answer card" do
    scheduler = Sm2.new(%Config{})
    card = Sm2.answer_card(%Card{}, scheduler, :again)
    assert card.due > 0
  end

  test "bury & unbury card" do
    scheduler = Sm2.new(%Config{})
    card = Sm2.bury_card(%Card{}, scheduler)
    assert card.card_queue == :buried

    card = Sm2.unbury_card(%Card{}, scheduler)
    assert card.card_queue == :new
  end

  test "suspend & unsuspend card" do
    scheduler = Sm2.new(%Config{})
    card = Sm2.suspend_card(%Card{}, scheduler)
    assert card.card_queue == :suspended

    card = Sm2.unsuspend_card(%Card{}, scheduler)
    assert card.card_queue == :new
  end

  test "schedule card" do
    scheduler = Sm2.new(%Config{})
    card = Sm2.schedule_card_as_review(%Card{}, scheduler, 1, 10)
    assert card.card_queue == :review

    card = Sm2.schedule_card_as_new(%Card{}, scheduler)
    assert card.card_queue == :new
  end
end
