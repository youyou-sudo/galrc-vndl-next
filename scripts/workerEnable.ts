import { Worker } from "bullmq";
import { fakeHeavyTask } from "@/lib/task/workerDataPull";
import { redisConfig } from "@/lib/redis";

let workerInstance: Worker | undefined;

export function getWorkerInstance() {
  if (!workerInstance) {
    try {
      workerInstance = new Worker(
        "myQueue",
        async (job) => {
          console.log("执行任务:", job.data);
          if (job.name === "workerDataPull") {
            await fakeHeavyTask(30000);
          }
        },
        { connection: redisConfig, concurrency: 5 }
      );

      workerInstance.on("completed", (job) => {
        console.log(`✅ 任务完成: ${job.id}`);
      });

      workerInstance.on("failed", (job, err) => {
        console.error(`❌ 任务失败: ${job?.id}`, err.message);
      });
    } catch (error) {
      console.error("Worker 初始化失败，可能是 Redis 连接错误", error);
      workerInstance = undefined;
    }
  }
  return workerInstance;
}

getWorkerInstance(); // 确保 Worker 在应用启动时被初始化
