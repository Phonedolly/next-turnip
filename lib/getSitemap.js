import Post from '@/schemas/post';
import now from './now';
import postTimeAlignmentor from './postTimeAlignmentor';
import checkCanLoadMore from './checkCanLoadMore';
import dbConnect from './mongoose';
import probe from 'probe-image-size';

// export async function getPostsOnFirstPage() {
//   await dbConnect();

//   const posts = (await Post
//     .find({})
//     .sort({ _id: -1 })
//     .limit(20))
//     .map(eachPost => postTimeAlignmentor(eachPost));

//   const canLoadMoreSitemap = await checkCanLoadMore({}, 0);

//   return {
//     posts,
//     canLoadMoreSitemap
//   }
// }

export async function getSitemapIndicesAfterFirstPage() {
  await dbConnect();

  const skippedFirstTwentyPosts = await Post
    .find({})
    .sort({ _id: -1 })
    .skip(20)
  const sitemapIndices = [];
  const len = skippedFirstTwentyPosts.length;
  const cnt = Math.floor(len / 20) + (Math.floor(len % 20) > 0 ? 1 : 0);
  for (let i = 1; i <= cnt; i++) {
    sitemapIndices.push({
      params: {
        sitemapIndex: `${i}`
      }
    })
  }
  return sitemapIndices;
}

// export async function getSitemapIndices() {
//   await dbConnect();

//   const posts = await Post
//     .find({})
//     .sort({ _id: -1 })
//   const sitemapIndices = [];
//   const len = posts.length;
//   const cnt = Math.floor(len / 20) + (Math.floor(len % n) > 0 ? 1 : 0);
//   for (let i = 0; i < cnt; i++) {
//     sitemapIndices.push({ params: { id: `${i}` } })
//   }
//   return sitemapIndices;
// }

export async function getAllPosts(sitemapIndex, categoryId) {
  await dbConnect();

  let posts;
  const canLoadMoreSitemap = await checkCanLoadMore(categoryId !== undefined ? { category: categoryId } : {}, sitemapIndex);

  if (sitemapIndex === 0) {
    posts = (await Post
      .find(categoryId !== undefined ? { category: categoryId } : {})
      .sort({ _id: -1 })
      .limit(20))
      .map((eachPost) => postTimeAlignmentor(eachPost))
  }
  else {
    const skippedFirstTwentyPosts = (await Post
      .find(categoryId !== undefined ? { category: categoryId } : {})
      .sort({ _id: -1 })
      .skip(20))
      .map((eachPost) => postTimeAlignmentor(eachPost));
    posts = dividePostsByTwenty(skippedFirstTwentyPosts)[sitemapIndex - 1];
  }
  posts = await Promise.all(
    posts.map(async eachPost => {
      if (eachPost.thumbnailURL === undefined) {
        return Promise.resolve({
          ...eachPost,
          thumbnailSize: null,
          thumbnailURL: null
        })
      } else {
        return Promise.resolve({
          ...eachPost,
          thumbnailSize: await probe(eachPost.thumbnailURL).catch((err) => { console.error(err); console.error('에러'); return { width: 500, height: 300 } })
        })
      }
    }
    )
  )
  return ([
    posts,
    canLoadMoreSitemap
  ])
}

const dividePostsByTwenty = (posts) => {
  const copiedPosts = posts.map(eachPost => eachPost);
  const len = copiedPosts.length;
  const cnt = Math.floor(len / 20) + (Math.floor(len % 20) > 0 ? 1 : 0);
  let tmp = [];

  for (let i = 0; i < cnt; i++) {
    tmp.push(copiedPosts.splice(0, 20));
  }
  return tmp;
}