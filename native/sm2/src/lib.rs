mod srs;
mod svc;

use rustler::{Encoder, Env, Error, ResourceArc, Term};

use crate::srs::card::Card;
use crate::srs::config::Config;
use crate::srs::scheduler::{Choice, Sched, Scheduler};
use crate::svc::timestamp::Timestamp;

mod atoms {
    rustler::atoms! {
        ok,
        error,
    }
}

fn load(env: Env, _: Term) -> bool {
    rustler::resource!(Scheduler, env);
    rustler::resource!(Card, env);
    rustler::resource!(Config, env);
    true
}

#[rustler::nif]
fn new(config: Config) -> Result<ResourceArc<Scheduler>, Error> {
    let scheduler = Scheduler::new(config, Timestamp::day_cut_off());
    Ok(ResourceArc::new(scheduler))
}

#[rustler::nif]
fn next_interval(
    scheduler: ResourceArc<Scheduler>,
    card: Card,
    choice: Choice,
) -> Result<i64, Error> {
    Ok(scheduler.next_interval(&card, choice))
}

#[rustler::nif]
fn answer_card(
    scheduler: ResourceArc<Scheduler>,
    card: Card,
    choice: Choice,
) -> Result<Card, Error> {
    let mut card = card.clone();
    scheduler.answer_card(&mut card, choice);
    Ok(card)
}

rustler::init!(
    "Elixir.RepeatNotes.Sm2",
    [new, next_interval, answer_card],
    load = load
);
