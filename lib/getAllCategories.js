import mongoose from 'mongoose';
import Category from '@/schemas/category';
import Post from '@/schemas/post';

export default async function getAllCategories() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME, useNewUrlParser: true, })
        .then(result => console.log("connected to mongodb!"))
        .catch(err => console.error(err));

    const rawCategories = await Category.find({}).sort({ index: 1 });
    const lengths = await Promise.all(rawCategories.map(async (eachCategory) => {
        const value = (await Post.find({ category: { _id: eachCategory._id.toString() } })).length
        return value;
    }))

    return ( rawCategories.map((eachCategory, i) => ({
        index: eachCategory.index,
        categoryName: eachCategory.categoryName,
        categoryURL: eachCategory.categoryURL,
        numOfPosts: lengths[i]
    })));
}