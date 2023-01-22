import dbConnect from "./mongoose";

import Category from '@/schemas/category';

export async function getSitemapByCategory() {
  await dbConnect();

  const categories = await Category.find({}).sort({ index: 1 })
  const sitemapIndices = categories.map(eachCategory => ({
    params: {
      categoryUrl: `${eachCategory.categoryURL}`,
    }
  }));


  return sitemapIndices;
}