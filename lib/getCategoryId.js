import dbConnect from "./mongoose";
import Category from '@/schemas/category'


export async function getCategoryId(categoryUrl) {
    await dbConnect();
    const categoryId = (await Category.findOne({ categoryURL: categoryUrl }))._id;

    return categoryId;
}