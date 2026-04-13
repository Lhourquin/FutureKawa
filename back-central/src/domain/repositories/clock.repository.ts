export const CLOCK = Symbol('CLOCK');

export abstract class Clock {
  abstract now(): Date;
}
