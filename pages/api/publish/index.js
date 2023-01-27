import isLoggedIn from "@/lib/isLoggedIn";
import dbConnect from "@/lib/mongoose";
import Category from '@/schemas/category';
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

  await dbConnect();
  const thisCategoryExists = !! await Category.find({ _id: req.body.category });
  if (!thisCategoryExists) {
    return res.status(500).send("This category don't exists");
  }

  const postURL = slugger(req.body.title, { maintainCase: true ,alsoAllow:"ㄱ-힣"})
  console.log(postURL)
  res.status(200).send({ isLoggedIn: true, postURL })
}