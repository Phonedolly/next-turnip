import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import s3 from "@/lib/s3";
import formidable from 'formidable'

import getToday from '@/lib/getToday';
import probe from "probe-image-size";

export default async function handler(req, res) {
  // const fileData = await new Promise((resolve, reject) => {
  //     const form = new formidable.IncomingForm();
  //     form.parse(req, (err, fields, files) => {
  //         if (err) {
  //             return reject(err);
  //         }
  //         return resolve(files);
  //     })
  // })
  console.log(req.body)
  const { url, fields } = await createPresignedPost(s3, {
    Bucket: process.env.S3_BUCKET,

    Key: `${getToday()}/${Date.now().toString()}_${req.body.fileName}`,
    Fields: {
      'Content-Type': req.body.fileType,
    },
    Expires: 60
  }).catch(e => {
    console.error('Image Prepost Failed');
    console.error(e);
    res.status(500).send({
      isImagePrePostSuccess: false
    })
  })

  res.status(200).send({
    isImagePrePostSuccess: true,
    imageUrl: `${url}${fields.key}`,
    url,
    fields,
  });
}
