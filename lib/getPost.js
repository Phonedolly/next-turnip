import mongoose from 'mongoose';
import Post from '@/schemas/post';
import postTimeAlignmentor from './postTimeAlignmentor';

export async function getPostsStaticPaths() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
    .then(result => console.log("connected to mongodb!"))
    .catch(err => console.error(err));

  const paths = (await Post.find({})).map((eachPost) => ({
    params: {
      postURL: eachPost.postURL
    }
  }))

  return paths;
}

export async function getPost(postURL) {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
    .then(result => console.log("connected to mongodb!"))
    .catch(err => console.error(err));

  const post = postTimeAlignmentor(await Post
    .findOne({ postURL }))

  return {
    title: post.title,
    content: post.content,
    postURL: post.postURL,
    images: post.images,
    thumbnailURL: post.thumbnailURL,
    createdAt: post.createdAt
  }
}
