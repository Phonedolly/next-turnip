import redisClient from "@/lib/redis";
import { deleteCookie } from "cookies-next";

export default async function handler(req, res) {
  console.log(`hello `, req.headers.authorization);
  await redisClient;
  await redisClient.setEx(req.headers.authorization.split(" ")[1],
    process.env.ACCESS_TOKEN_BLACKLIST_EXPIRE_TIME, 'logout')
  deleteCookie('refreshToken', { req, res });
  return res.send('Logout Success');
}