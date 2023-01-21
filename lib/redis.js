import { createClient } from 'redis';

export async function createRedisClient() {
  // console.log(process.env.REDIS_PASSWORD)
  const redisClient = createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_DB_NUM,
    database: process.env.REDIS_DB_NUM,
    // password: process.env.REDIS_PASSWORD
  });

  await redisClient.connect();

  return redisClient;
}