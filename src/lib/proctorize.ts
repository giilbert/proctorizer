// It's fine to block the main thread here!

import type { Input, Output } from "./worker";

const compute = (input: Input): Output => {
  let product = 0;

  for (let i = 0; i < input.y; i++) {
    product += input.x;
  }

  return { product };
};

self.addEventListener("message", (event) => {
  self.postMessage(compute(event.data));
});
