import { optId } from "./index";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDistinct(): R;
      toMatchPattern(pattern: RegExp): R;
    }
  }
}

beforeAll(() => {
  expect.extend({
    toBeDistinct(received) {
      const pass =
        Array.isArray(received) &&
        new Set(received).size === received.length;
      if (pass) {
        return {
          message: () => `expected [${received}] array is unique`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected [${received}] array is not to unique`,
          pass: false,
        };
      }
    },
    toMatchPattern(received, pattern: RegExp) {
      if (typeof received !== "string") {
        return {
          message: () => `expected [${received}] is not a string`,
          pass: false,
        };
      }
      const pass = pattern.test(received);
      if (pass) {
        return {
          message: () =>
            `expected [${received}] string matches pattern`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected [${received}] string does not match pattern`,
          pass: false,
        };
      }
    },
  });
});

it("exports correct interface", () => {
  expect(optId).toBeDefined();
  expect(optId).toHaveProperty("generate");
});

it("generates an id", () => {
  expect(optId.generate()).toHaveLength(1);
});

it("generates an id that is 32 characters in length", () => {
  const [id] = optId.generate();
  expect(id).toHaveLength(32);
});

it("generates an id that only contains valid hex characters", () => {
  const [id] = optId.generate();
  expect(id).toMatchPattern(/^[a-f0-9]{32}$/);
});

it("generates n ids", () => {
  const ids = optId.generate(10);
  expect(ids).toHaveLength(10);
});

it("generates n ids that are unique", () => {
  const ids = optId.generate(10);
  expect(ids).toBeDistinct();
});

it("generates n ids that are in ascending order", () => {
  const ids = optId.generate(20);

  const sortedIds = [...ids].sort((a, b) => {
    a = a
      .match(/[a-f0-9]{0,2}/g)!
      .reverse()
      .join("");
    b = b
      .match(/[a-f0-9]{0,2}/g)!
      .reverse()
      .join("");
    return a < b ? -1 : a > b ? 1 : 0;
  });

  expect(ids).toStrictEqual(sortedIds);
});
