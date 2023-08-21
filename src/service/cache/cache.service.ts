import redis from '../../config/redis';
const time = 60 * 60 * 24 * 30;
class CacheService {
    async set(key: string, nestedKey: number, value: any) {
        try {
            if (!redis.isOpen) {
                await redis.connect();
            }
            await new Promise((resolve, reject) => {
                redis.set(key + ':' + nestedKey, JSON.stringify(value), { EX: time });
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async get(key:string, nestedKey:number) {
        try {

            if (!redis.isOpen) {
                await redis.connect();
            }
            const value: any = await redis.get(key + ':' + nestedKey);
            // await redis.quit();
            return JSON.parse(value);
        } catch (err) {
            console.log("gettttt" + err);
            throw err;
        }
    }
    async delete (key:string, nestedKey:number) {
        if (!redis.isOpen) {
          await redis.connect();
        }
        await redis.del(key + ':' + nestedKey);
        // await redis.quit();
      }
}
export default new CacheService();