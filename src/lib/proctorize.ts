// It's fine to block the main thread here!

import type { Input, Output } from "./worker";

/**
 * General questions:
 * - What are "reserves"?
 *   -> backups - if a teacher isnt present
 *   -> "breaks" category: for teachers that go around telling people to get breaks
 *
 * - What are "exam packs"?
 *   -> people who collect exams at the end of the test. put these at the end of the test. no other responsibilities
 *
 * - What is "seniority"?
 *   -> how long a teacher has been here
 *   -> basically a priority.
 *   -> prioritize less senior teachers for assignments (THIS MEANS LOWER DURATION)
 *   -> higher seniority teachers get hallways
 *
 *
 * -> extend times get more proctors (3)
 */

// TODO: ADD INPUT

// TODO: figure out special rooms like cafe and library

interface RawProctor {
  name: string;
  email: string;
  gender: string; // "male" | "female" | null for bathroom hall proctor assignments

  // when teachers get to school
  startTime: string; // time formated in HH:MM AM/PM (not in timestamp format)
  // when teachers leave school
  endTime: string; // ^^

  timesUnavailable: string; // a third spreadsheet contianing this information

  // what's this for?
  subject: string; // teachers cant proctor their own subject (THIS IS ONE SUBJECT). ex: "calculus", "geometry", "algebra"
  seniority: string; // number

  // booleans are either 1 or 0 or something on excel
  // one column with maybe 3 letters
  // or maybe string flags
  flags: string; // for the below:
  // isReserveOnly: string; // a boolean: "only backup"
  // isHallProctorOrExamPackOnly: string; // booleans
  // isFrontDoorOnly: string; // booleans
}

type Gender = "male" | "female" | null;
type Time = number;

interface Proctor {
  name: string;
  email: string;
  gender: Gender;
  startTime: Time;
  endTime: Time;
  timesUnavailable: Time[];
  subject: string; // TODO: parsing validation in this?
  seniority: number; // numbers of years theyve been here
  isReserveOnly: boolean;
  isHallProctorOrExamPackOnly: boolean;
  isFrontDoorOnly: boolean;
}

// this includes all the tests, the hall proctors, the door proctors, and the exam pack (?) proctors?
interface RawExam {
  name: string;
  locations: string; // another spreadsheet

  startTime: string; // start time (for staff)
  arriveTime: string; // when students should get here
  endTime: string; // end time ()

  // "1st/2nd/3rd proctor" -> is this an enumeration
  //
  // session: string;

  numberOfProctors: string;
  timing: string; // "standard" | "2x" | "1.5x" -> each require different number of proctors

  // WDTM
  // "room and reserve only"
  subject: string; // many subjects separated by commas used in determining which teachers cant be chosen as proctorrss. ex: "geometry,algebra"
  numberOfSimultaneousProctors: string; // number | 1
  // WDTM
  // "room/hall/reserve/exam pack/front door"
  additionalJobs: string;

  numberOfReserves: string; // number

  // rooms: string; // another spreadsheet
}

// Input CSV must not have commas in values, must have headers in top row
const CsvtoJson = <T>(csv: string) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (const line of lines.slice(1)) {
    const obj = {} as Record<string, unknown>;
    const columns = line.split(",");

    for (let columnIndex = 0; columnIndex < headers.length; columnIndex++)
      obj[headers[columnIndex]] = columns[columnIndex];

    result.push(obj);
  }

  return result as T[];
};

const compute = (input: Input): Output => {
  const proctors = CsvtoJson<RawProctor>(input.teachersAsCsv);
  const sessions = CsvtoJson<RawExam>(input.testsAsCsv);

  console.log(proctors);
  console.log(sessions);

  return { csv: JSON.stringify(proctors) };
};

self.addEventListener("message", (event) => {
  self.postMessage(compute(event.data));
});
