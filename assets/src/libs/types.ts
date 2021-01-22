export type User = {
  id: number;
  email: string;
  inserted_at: number;
};

export enum SyncStatus {
  Success = 1,
  Syncing,
  Error,
}

export enum CardType {
  New = 0,
  Learn = 1,
  Review = 2,
  Relearn = 3,
}

export enum CardQueue {
  // due is the order cards are shown in
  New = 0,

  // due is number of seconds since epoch
  Learn = 1,

  // due is number of days since epoch
  Review = 2,
  DayLearn = 3,

  /// cards are not due in these states
  Suspended = -1,
  Buried = -2,
}

export type Card = {
  id: string;
  card_type: CardType;
  card_queue: CardQueue;
  due: number;
  interval: number;
  ease_factor: number;
  reps: number;
  lapses: number;
  remaining_steps: number;
};

export enum Choice {
  Again = 1,
  Hard = 2,
  Ok = 3,
  Easy = 4,
}
