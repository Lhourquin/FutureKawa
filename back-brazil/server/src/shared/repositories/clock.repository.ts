export const CLOCK = Symbol('CLOCK');

export abstract class ClockRepository {
  abstract now(): Date;
}
