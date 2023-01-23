import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_DB_NUM,
  database: process.env.REDIS_DB_NUM,
  password: process.env.REDIS_PASSWORD
});

redisClient.connect();

export default redisClient;
