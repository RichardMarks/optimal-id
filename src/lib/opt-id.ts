import { v1 } from "./ka-uuid-v1";
import type { IOptId, OptimalId } from "./types";

export function generate(numIds?: number): OptimalId[] {
  const count: number = numIds || 1;
  const generated: OptimalId[] = new Array<OptimalId>(count);
  for (let i = 0; i < count; i++) {
    generated[i] = v1.next();
  }
  return generated;
}

export const optId: IOptId = {
  generate,
};
