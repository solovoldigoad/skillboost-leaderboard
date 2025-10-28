import { Queue, Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

// Queue for syncing student progress
export const syncQueue = new Queue('studentSync', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// Queue scheduler for handling delayed jobs and retries
export const syncScheduler = new QueueScheduler('studentSync', {
  connection,
});

// Worker configuration
export const createSyncWorker = (processCallback: (job: any) => Promise<void>) => {
  return new Worker(
    'studentSync',
    async (job) => {
      try {
        await processCallback(job);
      } catch (error: any) {
        console.error(`Error processing job ${job.id}:`, error.message);
        throw error;
      }
    },
    {
      connection,
      concurrency: 5, // Process 5 jobs concurrently
      limiter: {
        max: 1, // Maximum number of jobs processed
        duration: 1000, // per second
      },
    }
  );
};

// Helper function to add a sync job to the queue
export const enqueueSyncJob = async (studentId: string, priority = 0) => {
  await syncQueue.add(
    'syncStudent',
    { studentId },
    {
      priority,
      jobId: `sync:${studentId}:${Date.now()}`,
      removeOnComplete: true,
      removeOnFail: 100, // Keep the last 100 failed jobs
    }
  );
};