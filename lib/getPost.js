import Post from '@/schemas/post';
import createMongooseInstance from './mongoose';
import postTimeAlignmentor from './postTimeAlignmentor';

export async function getPostsStaticPaths() {
   createMongooseInstance();

  const paths = (await Post.find({})).map((eachPost) => ({
    params: {
      postURL: eachPost.postURL
    }
  }))

  return paths;
}

export async function getPost(postURL) {
  createMongooseInstance();

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
