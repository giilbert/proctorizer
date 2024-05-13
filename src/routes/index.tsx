import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorker } from "@/lib/worker";
import { createFileRoute } from "@tanstack/react-router";

const IndexPage: React.FC = () => {
  const worker = useWorker();
  return (
    <div className="flex gap-2 flex-col">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formDataObj = new FormData(e.currentTarget);
          const formData = Object.fromEntries(formDataObj) as {
            teachers: File;
            tests: File;
          };

          if (formData.teachers && formData.tests) {
            const files = [formData.teachers, formData.tests].map((file) => {
              const reader = new FileReader();

              return new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsText(file);
              });
            });

            const res = (await Promise.all(files)) as string[];
            worker.compute({
              teachersAsCsv: res[0],
              testsAsCsv: res[1],
            });
          }
        }}
      >
        <div className="grid grid-cols-2 w-2/3 gap-4">
          <label htmlFor="teachers">Teachers:</label>
          <Input type="file" name="teachers" id="teachers" />
          <label htmlFor="tests">Tests:</label>
          <Input type="file" name="tests" id="tests" />
          <Button type="submit">Submit</Button>
        </div>
      </form>

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
