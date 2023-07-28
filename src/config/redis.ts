import * as redis from 'redis';
const instance = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

instance.on('connect', () => {
  console.log('Redis client connected');
});

instance.on('error', (err) => {
  console.log('Something went wrong ' + err);
});

export default instance;
