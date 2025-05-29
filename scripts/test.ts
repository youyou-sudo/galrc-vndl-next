import { getQueuefClient } from "@/lib/queue/queue";

const Queuef = await getQueuefClient();

const jobs = await Queuef.getJobs(
  ["waiting", "active", "completed", "failed", "delayed"],
  0,
  50
);

console.log(jobs);

await Queuef.close(); // 添加这一行！
