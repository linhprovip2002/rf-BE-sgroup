import * as redis from 'redis';
import env from 'dotenv';
env.config();
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
console.log(redisUrl)
const instance = redis.createClient(
  { url: redisUrl });

instance.on('connect', () => {
  console.log('Redis client connected');
});

instance.on('error', (err) => {
  console.log('Something went wrong ' + err);
});
instance.connect()
export default instance;
