import dbus from '@homebridge/dbus-native'
import now from '@/lib/now';
import jwt from 'jsonwebtoken';

import { createRedisClient } from '@/lib/redis';

export default async function handler(req, res) {
  let verify = true;
  if (!req.cookies.refreshToken) {
    if (process.env.NODE_ENV === 'development') {
      console.error(now() + "refreshToken Not Found")
    }
    return res.json({ isSilentRefreshSucess: false })
  }
  jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error) {
        console.error(now() + "refreshToken verify failed")
        res.json({ isSilentRefreshSucess: false })
        verify = false;
      }
    })
  if (!verify) {
    return;
  }
  const redisClient = await createRedisClient();
  const accessToken = jwt.sign(
    { id: redisClient.get(req.cookies.refreshToken) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  )
  const refreshToken = jwt.sign(
    { id: redisClient.get(req.cookies.refreshToken) },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '300m' }
  )
  res.cookie('refreshToken', refreshToken, { httpOnly: true })
  res.send({ accessToken, isSilentRefreshSuccess: true })
  if (process.env.NODE_ENV === 'development') {
    console.log("success refresh tokens")
  }
}