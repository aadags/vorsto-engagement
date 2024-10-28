import { RedisClientType, createClient } from 'redis';

declare let global: {
  redisClient: RedisClientType;
};

let redisClient: RedisClientType;


if (!global.redisClient) {

redisClient = createClient({
  url: process.env.REDIS

});
redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
redisClient.connect();
global.redisClient = redisClient;

} else {

  redisClient = global.redisClient
}

export default redisClient;
