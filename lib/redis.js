import { createClient } from 'redis';

const redisClient = createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_DB_NUM,
  database: process.env.REDIS_DB_NUM,
  password: process.env.REDIS_PASSWORD
});

redisClient.ping().catch(async (e) => {
  await redisClient.connect()
    .catch(() => {
      console.log('redis client connected')
    }).catch(connectionError => {
      console.error('redis client connection error')
      console.error(connectionError)
    })
})

export default redisClient;
