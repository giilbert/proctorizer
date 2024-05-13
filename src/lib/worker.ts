import { useCallback, useEffect, useRef, useState } from "react";

export interface Input {
  teachersAsCsv: string;
  testsAsCsv: string;
}

export interface Output {
  csv: string;
}

type WorkerState =
  | {
      type: "loading";
    }
  | {
      type: "idle";
    }
  | {
      type: "computing";
      start: Date;
    }
  | {
      type: "success";
      data: Output;
    }
  | {
      type: "error";
      error: ErrorEvent;
    };

export const useWorker = () => {
  const [state, setState] = useState<WorkerState>({
    type: "loading",
  });
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (workerRef.current) return;

    const worker = new Worker(new URL("./proctorize.ts", import.meta.url), {
      type: "module",
    });

    worker.addEventListener("error", (event) => {
      setState({ type: "error", error: event });
    });
    worker.addEventListener("message", (event) => {
      setState({ type: "success", data: event.data });
    });

    setState({ type: "idle" });

    workerRef.current = worker;

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const compute = useCallback(
    (input: Input) => {
      if (state.type === "idle") {
        setState({
          type: "computing",
          start: new Date(),
        });
        workerRef.current?.postMessage(input);
      }
    },
    [state.type]
  );

  return { state, compute };
};
