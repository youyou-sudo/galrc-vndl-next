import { getRedisClient } from "./index"; // 路径按你的项目结构改

const redis = getRedisClient();
export const setKv = async (key: string, value: string, time?: number) => {
  if (!redis) return;
  return time ? redis.setex(key, time, value) : redis.set(key, value);
};

export const getKv = async (key: string) => {
  if (!redis) return null;
  return redis.get(key);
};

export const delKv = async (key: string) => {
  if (!redis) return;
  return redis.del(key);
};
