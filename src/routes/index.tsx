import { Input } from "@/components/ui/input";
import { useWorker } from "@/lib/worker";
import { createFileRoute } from "@tanstack/react-router";

const IndexPage: React.FC = () => {
  const worker = useWorker();
  return (
    <div className="flex gap-2 flex-col">
      <Input
        type="file"
        onChange={async (e) => {
          if (e.currentTarget.files) {
            const file = e.currentTarget.files && e.currentTarget.files[0];
            const reader = new FileReader();

            reader.addEventListener("load", (event) => {
              const data = event.target?.result as string;
              worker.compute({
                teachersCSV: data,
                testsCSV: "",
              });
            });
            reader.readAsText(file);
          }
        }}
      />

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
