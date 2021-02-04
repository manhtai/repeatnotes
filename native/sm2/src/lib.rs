mod srs;
mod svc;

use rustler::{Encoder, Env, Error, Term};

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
    rustler::resource!(Config, env);
    true
}

#[rustler::nif]
fn new(config: Config) -> Result<Scheduler, Error> {
    let scheduler = Scheduler::new(config, Timestamp::day_cut_off());
    Ok(scheduler)
}

#[rustler::nif]
fn next_interval(
    scheduler: Scheduler,
    card: Card,
    choice: Choice,
) -> Result<i64, Error> {
    Ok(scheduler.next_interval(&card, choice))
}

rustler::init!("Elixir.RepeatNotes.Sm2", [new, next_interval], load = load);
