export default function Card() {

  const clickMe = async () => {
    const wasm = await import('@repeatnotes/sm2')
    const sm2 = new wasm.Sm2({
      learn_steps: [1.0, 10.0],
      relearn_steps: [10.0],
      initial_ease: 2500,
      easy_multiplier: 1.3,
      hard_multiplier: 1.2,
      lapse_multiplier: 0.0,
      interval_multiplier: 1.0,
      maximum_review_interval: 36500,
      minimum_review_interval: 1,
      graduating_interval_good: 1,
      graduating_interval_easy: 4,
      leech_threshold: 8,
    }, BigInt(1611024541))

    const card = {
      card_type: 0,
      card_queue: 0,
      due: 0,
      interval: 0,
      ease_factor: 0,
      reps: 0,
      lapses: 0,
      remaining_steps: 0,
    }

    console.log("Next with 2", sm2.next_interval(card, 2))
    console.log("Answer with 2", sm2.answer_card(card, 2))
  }

  return (
    <div onClick={clickMe}>
      Click me!
    </div>
  )
}
