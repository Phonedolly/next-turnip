import dbConnect from "@/lib/mongoose";
import Post from '@/schemas/post';
import probe from "probe-image-size";

export default async function handler(req, res) {
  await dbConnect()
  const query = req.body.query;

  if (query.length <= 2) {
    console.log(`query is too short!`);
    return res.status(200).json({ searchResult: [] });
  }

  const searchResult = await Promise.all(
    (await Post
      .find({ $or: [{ title: new RegExp(query) }, { content: new RegExp(query) }] })
      .sort({ '_id': -1 })
    ).map(async eachPost => {
      let thumbnailSize = undefined;
      if (eachPost?.thumbnailURL) {
        try {

          thumbnailSize = await probe(eachPost.thumbnailURL);
        } catch (err) {
          console.error(`error occured at ${eachPost.thumbnailURL}`);
          console.error(err);
        }
      }
      return Promise.resolve({
        title: eachPost.title,
        thumbnailURL: eachPost.thumbnailURL,
        postURL: eachPost.postURL,
        thumbnailSize
      })
    })
  )

  console.log(`result out!`);
  res.status(200).json({ searchResult })
}