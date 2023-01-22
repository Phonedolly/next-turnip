import dbConnect from "./mongoose";

import Post from '@/schemas/post'
import { getCategoryId } from "./getCategoryId";
import { getSitemapByCategory } from "./getSitemapByCategory";

export async function getSitemapIndicesAfterFirstPageByCategory() {
  await dbConnect();

  const sitemapByCategory = await getSitemapByCategory();
  const paths = []
  await Promise.all(
    sitemapByCategory
      .map(async eachCategory => {
        const categoryUrl = eachCategory.params.categoryUrl;
        const sitemapIndices = [];
        const categoryId = await getCategoryId(categoryUrl);
        const len = (await Post
          .find({ category: categoryId })
          .sort({ _id: -1 })
          .skip(20))
          .length
        const cnt = Math.floor(len / 20) + (Math.floor(len % 20) > 0 ? 1 : 0);
        for (let i = 1; i <= cnt; i++) {
          paths.push({
            params: {
              categoryUrl,
              sitemapIndex: `${i}`
            }
          })
        }
        return Promise.resolve(sitemapIndices);
      })
  )

  return paths;
}