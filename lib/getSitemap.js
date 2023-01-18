import mongoose from 'mongoose';
import Post from '@/schemas/post';
import now from './now';
import postTimeAlignmentor from './postTimeAlignmentor';
import checkCanLoadMore from './checkCanLoadMore';

export async function getPostsOnFirstPage() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
    .then(result => console.log("connected to mongodb!"))
    .catch(err => console.error(err));

  const posts = (await Post
    .find({})
    .sort({ _id: -1 })
    .limit(20))
    .map(eachPost => postTimeAlignmentor(eachPost));

  const canLoadMoreSitemap = await checkCanLoadMore({}, 0);

  return {
    posts,
    canLoadMoreSitemap
  }
}

export async function getSitemapIndicesAfterFirstPage() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
    .then(result => console.log("connected to mongodb!"))
    .catch(err => console.error(err));

  const skippedFirstTwentyPosts = await Post
    .find({})
    .sort({ _id: -1 })
    .skip(20)
  const sitemapIndices = [];
  const len = skippedFirstTwentyPosts.length;
  const cnt = Math.floor(len / 20) + (Math.floor(len % n) > 0 ? 1 : 0);
  for (let i = 0; i < cnt; i++) {
    sitemapIndices.push({})
  }
  return sitemapIndices;
}

export async function getSitemapIndices() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
    .then(result => console.log("connected to mongodb!"))
    .catch(err => console.error(err));

  const posts = await Post
    .find({})
    .sort({ _id: -1 })
  const sitemapIndices = [];
  const len = posts.length;
  const cnt = Math.floor(len / 20) + (Math.floor(len % n) > 0 ? 1 : 0);
  for (let i = 0; i < cnt; i++) {
    sitemapIndices.push({ params: { id: `${i}` } })
  }
  return sitemapIndices;
}

export async function getAllPosts(isFirstPage = undefined) {
  let posts;
  let canLoadMoreSitemap;

  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
    .then(result => console.log("connected to mongodb!"))
    .catch(err => console.error(err));

  if (isFirstPage === true) {
    canLoadMoreSitemap = await checkCanLoadMore({}, 0);
    posts = (await Post.find({})
      .sort({ _id: -1 })
      .limit(20))
      .map(async (eachPost) => postTimeAlignmentor(eachPost))
  }
  else {
    const skippedFirstTwentyPosts = await Post.find({}).sort({ _id: -1 }).skip(20).map((eachPost) => postTimeAlignmentor(eachPost));
    posts = dividePostsByTwenty(skippedFirstTwentyPosts);
  }
  Post.find({}).sort({ "_id": -1 }).skip(20 * moreIndex).limit(20)
    .then(async (result) => {
      /* 포스트를 20개 외에 더 로드할 수 있는지 확인 */
      const canLoadMoreSitemap = await checkCanLoadMore({}, moreIndex);

      /* UTC(mongodb) to local time */
      timeAlignedResult = postTimeAlignmentor(result);

      res.send({ sitemap: timeAlignedResult, canLoadMoreSitemap });
    }, (err) => {
      console.error(err);
      console.error(now() + "failed to get more sitemap");
      return res.status(500).send();
    })
}



const dividePostsByTwenty = (posts) => {
  const copiedPosts = posts.map(eachPost => eachPost);
  const len = copiedPosts.length;
  const cnt = Math.floor(len / 20) + (Math.floor(len % n) > 0 ? 1 : 0);
  let tmp = [];

  for (let i = 0; i < cnt; i++) {
    tmp.push(copiedPosts.splice(0, 20));
  }
  return tmp;
}