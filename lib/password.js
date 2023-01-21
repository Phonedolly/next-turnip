import crypto from 'crypto';

import User from '@/schemas/user';

const createSalt = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString('base64'));
    });
  });

export const createHashedPassword = (plainPassword) =>
  new Promise(async (resolve, reject) => {
    const salt = await createSalt();
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      resolve({ password: key.toString('base64'), salt });
    });
  });

export const makePasswordHashed = (userId, plainPassword) =>
  new Promise(async (resolve, reject) => {
    const salt = await User.findOne({ id: userId })
      .then((result) => {
        if (!result) {
          console.error(now() + "없는 정보")
          return "NOT_VALID"
        }
        return result.salt
      });
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      resolve(key.toString('base64'));
    });
  });