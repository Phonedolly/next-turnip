import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

import dbConnect from "@/lib/mongoose";
import s3 from "@/lib/s3";
import isLoggedIn from "@/lib/isLoggedIn";
import now from "@/lib/now";

import Category from '@/schemas/category';
import Post from '@/schemas/post';
import slugger from "slugger";

export default async function handler(req, res) {
  /* Check Login */
  const checkLogin = await isLoggedIn(req)
    .catch((e) => {
      console.error(e)
      return false
    })
  if (checkLogin === false) {
    return res.status(500).send({ isLoggedIn: false })
  }


  /* Connect MongoDB */
  await dbConnect();

  const isPostExists = !!await Post.findOne({ title: req.body.title });
  if (isPostExists && req.body.isEdit === false) {
    return res.status(500).send({ isPublishSuccess: false, reason: "Post Title Duplicated" });
  }
  const thisCategoryExists = !! await Category.findOne({ _id: req.body.category._id });
  if (!thisCategoryExists) {
    return res.status(500).send({ isPublishSuccess: false, reason: "This category don't exists" });
  }

  /* Delete Unused Images in S3 */
  if (req.body?.imageBlacklist && req.body.imageBlacklist.length > 0) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: req.body.imageBlacklist
      },
      // Quiet: false
    }
    const deleteCommand = new DeleteObjectsCommand(params);
    const isDeleteSuccess = await s3.send(deleteCommand)
      .then((result) => {
        console.log('쓰지 않는 사진 삭제 성공')
        return true
      }, (err) => {
        console.error(now() + '쓰지 않는 사진 삭제 에러')
        console.error(err)

        res.status(500).send({ isPublishSuccess: false, reason: "failed to delete blacklist" });
        return false
      })
    if (isDeleteSuccess === false) {
      return;
    }
  }

  /* Create Post URL */
  const postUrl = slugger(req.body.title, { maintainCase: true, alsoAllow: "ㄱ-힣" })

  /* Create Or Modify Post */
  if (req.body.isEdit === false) {
    await Post.create({
      title: req.body.title,
      content: req.body.content,
      postURL: postUrl,
      images: req.body.imageWhitelist,
      thumbnailURL: req.body.thumbnailURL ? req.body.thumbnailURL : null,
      category: req.body.category
    })
  } else {
    await Post.updateOne(
      { _id: req.body._id }, {
      title: req.body.newTitle,
      content: req.body.content,
      postURL: postUrl,
      images: req.body.imageWhitelist,
      thumbnailURL: req.body.thumbnailURL ?? null,
      category: req.body.category
    })
  }

  res.status(200).send({ isPublishSuccess: true })
}