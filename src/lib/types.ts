export type OptimalId = string;

export interface IOptId {
  generate: (numIds?: number) => OptimalId[];
}

export interface IUUIDGenerator {
  _node: number[];
  _ns: number;
  _ms: number;
  _clock: number;
  _pool: Uint8Array;
  _offset: number;
  rng: () => Uint8Array;
  next: () => OptimalId;
}
