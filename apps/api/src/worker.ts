import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { db } from './db';
import { searchRuns, categories } from './db/schema';
import { eq } from 'drizzle-orm';
import { runSecEdgarPipeline } from './pipeline/sec-edgar';

const connection = new IORedis(process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`, { maxRetriesPerRequest: null });

const worker = new Worker('search-jobs', async job => {
  console.log(`Processing search job ${job.data.runId}`);
  const { runId } = job.data;

  // Update status to processing
  await db.update(searchRuns)
    .set({ status: 'processing', started_at: new Date() })
    .where(eq(searchRuns.id, runId));

  try {
    const run = await db.query.searchRuns.findFirst({ where: eq(searchRuns.id, runId) });
    if (!run) throw new Error('Search run not found');

    const category = await db.query.categories.findFirst({ where: eq(categories.id, run.category_id) });
    if (!category) throw new Error('Category not found');

    // Run the extraction pipeline
    await runSecEdgarPipeline(category.name, run.keywords);

    // Update status to completed
    await db.update(searchRuns)
      .set({ status: 'completed', completed_at: new Date() })
      .where(eq(searchRuns.id, runId));
      
    console.log(`Job ${runId} completed successfully.`);
  } catch (err) {
    console.error(`Job ${runId} failed:`, err);
    await db.update(searchRuns)
      .set({ status: 'failed' })
      .where(eq(searchRuns.id, runId));
  }
}, { connection });

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} has failed with ${err.message}`);
});

console.log('Worker is running and listening for jobs...');
