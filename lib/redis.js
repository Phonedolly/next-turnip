import redis from 'redis';

export async function createRedisClient() {
  const redisClient = redis.createClient({
    host: process.env.REDIS_URL,
    port: 6379,
    database: process.env.REDIS_DB_NUM,
    password: process.env.REDIS_PASSWORD
  });

  await redisClient.connect();

  return redisClient;
}