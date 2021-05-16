/*
  Assuming a standard v1 UUID of "4a6b9f70-b678-11eb-a7b6-032e6afcbc8e"
  This code provides the string "11ebb6784a6b9f70a7b6032e6afcbc8e"

  - rearranges bytes of timestamp for ordered ids
  - removes separator dash characters because we don't need to waste 4 bytes per id
  - zero third-party dependency libraries for a smaller payload

  Developed by Richard Marks 5/16/2021
  (c) 2021, MIT License.

  Thank you to the research of Peter Zaitsev and Karthik Appigatla.
*/
import * as crypto from "crypto";
import type { IUUIDGenerator, OptimalId } from "./types";

const hexmap: string[] = [
  "000102030405060708090a0b0c0d0e0f",
  "101112131415161718191a1b1c1d1e1f",
  "202122232425262728292a2b2c2d2e2f",
  "303132333435363738393a3b3c3d3e3f",
  "404142434445464748494a4b4c4d4e4f",
  "505152535455565758595a5b5c5d5e5f",
  "606162636465666768696a6b6c6d6e6f",
  "707172737475767778797a7b7c7d7e7f",
  "808182838485868788898a8b8c8d8e8f",
  "909192939495969798999a9b9c9d9e9f",
  "a0a1a2a3a4a5a6a7a8a9aaabacadaeaf",
  "b0b1b2b3b4b5b6b7b8b9babbbcbdbebf",
  "c0c1c2c3c4c5c6c7c8c9cacbcccdcecf",
  "d0d1d2d3d4d5d6d7d8d9dadbdcdddedf",
  "e0e1e2e3e4e5e6e7e8e9eaebecedeeef",
  "f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff",
]
  .join("")
  .match(/[a-f0-9]{0,2}/g)!
  .slice(0, -2);

const toHexByte = (n: number): string => hexmap[n];

export const v1: IUUIDGenerator = {
  _node: [0],
  _ns: 0,
  _ms: 0,
  _clock: 0,
  _pool: new Uint8Array(256),
  _offset: 256,

  rng(): Uint8Array {
    if (v1._offset > v1._pool.length - 16) {
      crypto.randomFillSync(v1._pool);
      v1._offset = 0;
    }
    const offset = v1._offset + 16;
    const n = v1._pool.slice(v1._offset, offset);
    v1._offset = offset;
    return n;
  },

  next(): OptimalId {
    if (v1._node.length === 1) {
      const seed: Uint8Array = v1.rng();
      v1._clock = ((seed[6] << 8) | seed[7]) & 0x3fff;
      v1._node = [
        seed[0] | 0x01,
        seed[1],
        seed[2],
        seed[3],
        seed[4],
        seed[5],
      ];
    }

    let ms: number = Date.now();
    const ns: number = v1._ns + 1;
    const dt: number = ms - v1._ms + (ns - v1._ns) / 10000;

    if (dt < 0) {
      v1._clock = (v1._clock + 1) & 0x3fff;
    }

    if (dt < 0 || ms > v1._ms) {
      v1._ns = 0;
    }

    if (v1._ns >= 10000) {
      throw new Error("ids/sec overflow");
    }

    v1._ms = ms;
    v1._ns = ns;

    ms += 12219292800000;

    const tl = ((ms & 0xfffffff) * 10000 + ns) % 0x100000000;
    const tmh = ((ms / 0x100000000) * 10000) & 0xfffffff;

    const uuid: OptimalId = [
      ((tmh >>> 24) & 0xf) | 0x10,
      (tmh >>> 16) & 0xff,
      (tmh >>> 8) & 0xff,
      tmh & 0xff,
      (tl >>> 24) & 0xff,
      (tl >>> 16) & 0xff,
      (tl >>> 8) & 0xff,
      tl & 0xff,
      (v1._clock >>> 8) | 0x80,
      v1._clock & 0xff,
      ...v1._node,
    ]
      .map(toHexByte)
      .join("");

    return uuid;
  },
};
