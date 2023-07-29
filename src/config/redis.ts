import * as redis from 'redis';
const instance = redis.createClient({
  url: process.env.REDIS_URL,
});

instance.on('connect', () => {
  console.log('Redis client connected');
});

instance.on('error', (err) => {
  console.log('Something went wrong ' + err);
});

export default instance;
