import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './db';
import { deepSearchTypes, categories, searchRuns } from './db/schema';
import { eq } from 'drizzle-orm';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import * as crypto from 'node:crypto';

const fastify = Fastify({ logger: true });

// Setup Redis & BullMQ
const connection = new IORedis(process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`, { maxRetriesPerRequest: null });
const searchQueue = new Queue('search-jobs', { connection });

fastify.register(cors, { origin: true });

fastify.get('/api/types', async (request, reply) => {
  const types = await db.select().from(deepSearchTypes);
  return types;
});

fastify.get('/api/types/:typeId/categories', async (request: any, reply) => {
  const cats = await db.select().from(categories).where(eq(categories.type_id, request.params.typeId));
  return cats;
});

fastify.post('/api/searches', async (request: any, reply) => {
  const { type_id, category_id, keywords } = request.body;

  // Insert search run
  const runId = crypto.randomUUID();
  const runData = {
    id: runId,
    type_id,
    category_id,
    keywords,
    status: 'pending',
  };
  await db.insert(searchRuns).values(runData);

  // Add to background queue
  await searchQueue.add('extract-investors', { runId });

  return runData;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
