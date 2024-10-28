
import redisClient from './redis';

export default class RedisHandler {
    id: string;

    expiresIn: number = parseInt('86400');


    constructor(id: string) {
        this.id = id;
    }

    cacheKey() {
        return `${this.id}`
    }

    instance() {
        return redisClient;
    }

    async getCachedValue() {
        const cache = await redisClient.get(this.cacheKey());
        return cache ? JSON.parse(cache) : null;
    }

    async setKey(result: any) {
        return await redisClient.setEx(this.cacheKey(), this.expiresIn, JSON.stringify(result))
    }

    async invalidateCacheValue() {

        const result = await redisClient.get(this.cacheKey());  // Ensure this is awaited
        if (result != null) {
            await redisClient.del(this.cacheKey());
        }
    }

    public static async getOrSet(key: string, cb: () => any, expiresIn: number = parseInt('86400')) {
        const value = await redisClient.get(key);
        if (value) {
            return JSON.parse(value);
        }

        const freshValue = await cb();
        await redisClient.setEx(key, expiresIn, JSON.stringify(freshValue));
        return freshValue;
    }

    public static async invalidateKey(key: string) {
        const result = await redisClient.get(key);  // Ensure this is awaited
        if (result != null) {
            await redisClient.del(key);
        }
    }

}


