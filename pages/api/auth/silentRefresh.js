import dbus from '@homebridge/dbus-native'
import now from '@/lib/now';
import jwt from 'jsonwebtoken';

import redisClient from '@/lib/redis';
import { getCookie, setCookie } from 'cookies-next';

export default async function handler(req, res) {
  let verify = true;
  const refreshTokenFromCookie = getCookie('refreshToken', { req, res });
  if (refreshTokenFromCookie === undefined) {
    if (process.env.NODE_ENV === 'development') {
      console.error(now() + "refreshToken Not Found")
    }
    return res.json({ isSilentRefreshSuccess: false })
  }
  jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error) {
        console.error(now() + "refreshToken verify failed")
        res.json({ isSilentRefreshSuccess: false })
        verify = false;
      }
    })
  if (!verify) {
    return;
  }

  await redisClient;
  const accessToken = jwt.sign(
    { id: redisClient.get(refreshTokenFromCookie) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  )
  const refreshToken = jwt.sign(
    { id: redisClient.get(refreshTokenFromCookie) },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '300m' }
  )
  // res.cookie('refreshToken', refreshToken, { httpOnly: true })
  setCookie('refreshToken', refreshToken, { httpOnly: true });
  res.send({ accessToken, isSilentRefreshSuccess: true })
  if (process.env.NODE_ENV === 'development') {
    console.log("success refresh tokens")
  }
}