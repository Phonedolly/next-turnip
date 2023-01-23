import jwt from 'jsonwebtoken';
import { getCookie, setCookie } from 'cookies-next'
import mongoose from 'mongoose';
import { makePasswordHashed } from "@/lib/password";
import redisClient from '@/lib/redis';
import now from '@/lib/now';

import User from '@/schemas/user';

export default async function handler(req, res) {
  if (mongoose.connection.readyState === 0) {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
      .then(result => console.log("connected to mongodb!"))
      .catch(err => console.error(err));
  }

  const hashed = (await makePasswordHashed(req.body.id, req.body.password))
  const origin = await User.findOne({ id: req.body.id })
    .then((userData) => userData?.password,
      (err) => { console.error(now() + "비밀번호 에러"); })

  const compareResult = hashed === origin

  if (!compareResult || !hashed || !origin) {
    return res.status(200).json({ isLoginSuccess: false })
  }

  const accessToken = jwt.sign(
    { id: req.body.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  )
  const refreshToken = jwt.sign(
    { id: req.body.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '300m' }
  )
  await redisClient;
  await redisClient.setEx(refreshToken, 1800, req.body.id);
  // res.cookie('refreshToken', refreshToken, { httpOnly: true })
  setCookie('refreshToken', refreshToken, { req, res, httpOnly: false });
  res.status(200).send({ isLoginSuccess: true, accessToken })
}