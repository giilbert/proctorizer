/* eslint-disable @typescript-eslint/no-unused-vars */
// It's fine to block the main thread here!

import type { Input, Output } from "./worker";

// Input CSV must not have commas in values, must have headers in top row
const CSVtoJSON = (csv: string) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (const line of lines) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {};
    const currentline = line.split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return result;
};

const compute = (input: Input): Output => {
  const teachers = CSVtoJSON(input.teachersCSV);
  const tests = CSVtoJSON(input.testsCSV);

  console.log(teachers);

  return { csv: JSON.stringify(teachers) };
};

self.addEventListener("message", (event) => {
  self.postMessage(compute(event.data));
});
