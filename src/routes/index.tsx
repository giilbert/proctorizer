import { Button } from "@/components/ui/button";
import { useWorker } from "@/lib/worker";
import { createFileRoute } from "@tanstack/react-router";

const IndexPage: React.FC = () => {
  const worker = useWorker();
  return (
    <div className="flex gap-2 flex-col">
      <Button
        onClick={() => {
          worker.compute({ x: 1, y: 9876542245 });
        }}
      >
        Compute
      </Button>

      <code>
        State:
        <br />
        {JSON.stringify(worker.state, undefined, "  ")}
      </code>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: IndexPage,
});
