import Category from '@/schemas/category';
import Post from '@/schemas/post';
import createMongooseInstance from './mongoose';

export default async function getAllCategories() {
    createMongooseInstance();

    const rawCategories = await Category.find({}).sort({ index: 1 });
    const lengths = await Promise.all(rawCategories.map(async (eachCategory) => {
        const value = (await Post.find({ category: { _id: eachCategory._id.toString() } })).length
        return value;
    }))

    return (rawCategories.map((eachCategory, i) => ({
        index: eachCategory.index,
        categoryName: eachCategory.categoryName,
        categoryURL: eachCategory.categoryURL,
        numOfPosts: lengths[i]
    })));
}