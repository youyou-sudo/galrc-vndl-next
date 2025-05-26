import { Queuef } from "@/lib/queue/queue";

await Queuef.add(
  "workerDataPull",
  { info: "信息" },
  {
    repeat: { pattern: "* * * * *" },
    jobId: "repeat-every-minute",
  }
);
