import redisClient from "@/lib/redis";
import jwt from 'jsonwebtoken';

export default async function isLoggedIn(req) {
  return new Promise(async (resolve, reject) => {
    if (!req.headers.authorization) {
      return reject({
        isLoggedIn: false
      })
    }

    if (await redisClient.get(req.headers.authorization.split(" ")[1]) === 'logout') {
      return reject({
        isLoggedIn: false
      })
    }

    jwt.verify(req.headers.authorization.split(" ")[1], process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        console.error(error)
        return reject({
          isLoggedIn: false
        })
      } else {
        return resolve({
          isLoggedIn: true
        })
      }
    })
  })
}