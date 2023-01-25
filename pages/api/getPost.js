import dbConnect from "@/lib/mongoose";

import Post from '@/schemas/post';

export default async function handler(req, res) {
    await dbConnect();
    console.log(`from server` + req.body.postURL)
    const post = await Post.findOne({ postURL: req.body.postURL })
        .then((result) => {
            return { postData: result }
        }, (error) => {
            console.error(error)
            return { postData: "Post Not Found" }
        })
    res.status(200).send(post)
}