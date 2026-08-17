import { db } from './index';
import { deepSearchTypes, categories } from './schema';
import * as crypto from 'node:crypto';

async function seed() {
  console.log('Seeding deep search types and categories...');

  const appTypeId = crypto.randomUUID();
  const healthTypeId = crypto.randomUUID();
  const saasTypeId = crypto.randomUUID();
  const fintechTypeId = crypto.randomUUID();
  const hardwareTypeId = crypto.randomUUID();

  // 1. Insert Deep Search Types
  await db.insert(deepSearchTypes).values([
    { id: appTypeId, name: 'App', slug: 'app' },
    { id: healthTypeId, name: 'Health & Wellness', slug: 'health-wellness' },
    { id: saasTypeId, name: 'SaaS', slug: 'saas' },
    { id: fintechTypeId, name: 'Fintech', slug: 'fintech' },
    { id: hardwareTypeId, name: 'Hardware', slug: 'hardware' },
  ]);

  console.log(`Inserted 5 deep search types.`);

  // 2. Insert Categories
  await db.insert(categories).values([
    { id: crypto.randomUUID(), type_id: appTypeId, name: 'Pregnancy', slug: 'pregnancy', description: 'Apps related to pregnancy tracking and health.' },
    { id: crypto.randomUUID(), type_id: appTypeId, name: 'Fitness', slug: 'fitness', description: 'Workout and fitness apps.' },
    { id: crypto.randomUUID(), type_id: healthTypeId, name: 'Sleep', slug: 'sleep', description: 'Sleep tracking and optimization.' },
    { id: crypto.randomUUID(), type_id: healthTypeId, name: 'Mental Health', slug: 'mental-health', description: 'Therapy and mental wellness platforms.' },
    { id: crypto.randomUUID(), type_id: healthTypeId, name: 'Pet Care', slug: 'pet-care', description: 'Veterinary and pet wellness.' },
  ]);

  console.log(`Inserted 5 categories.`);
  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
