import dbConnect from "@/lib/mongoose";
import s3 from "@/lib/s3";

import isLoggedIn from "@/lib/isLoggedIn";

import Category from '@/schemas/category';
import Post from '@/schemas/post';
import slugger from "slugger";

export default async function handler(req, res) {
  /* Check Login */
  const checkLogin = await isLoggedIn(req)
    .catch((e) => {
      console.error(e)
      res.status(500).send({ isLoggedIn: false })
      return false
    })
  if (checkLogin === false) {
    return
  }

  /* Connect MongoDB */
  await dbConnect();

  const isPostExists = !!await Post.findOne({ title: req.body.title });
  if (!isPostExists) {
    return res.status(500).send({ isPublishSuccess: true, reason: "Post Title Duplicated" });
  }

  const thisCategoryExists = !! await Category.find({ _id: req.body.category });
  if (!thisCategoryExists) {
    return res.status(500).send({ isPublishSuccess: true, reason: "This category don't exists" });
  }

  /* Delete Unused Images in S3 */
  if (req.body.imageBlacklist || req.body.imageBlacklist.length > 0) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: req.body.imageBlacklist
      },
      // Quiet: false
    }
    const deleteCommand = new DeleteObjectsCommand(params);
    await s3.send(deleteCommand)
      .then((result) => {
        console.log('쓰지 않는 사진 삭제 성공')
        return next();
      }, (error) => {
        console.error(now() + '에러')
        console.error(error)

        return res.status(500).send({ isPublishSuccess: true, reason: "failed to delete blacklist" });
      })
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

  // TODO Implement Sitemap Update

  res.status(200).send({ isPublishSuccess: true })
}