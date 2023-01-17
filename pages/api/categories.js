import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
    // res.status(200).json(
    //     {
    //         categories: [{ categoryName: '뉴스', categoryLink: 'news' },
    //         { categoryName: '루머', categoryLink: 'rumor' }]
    //     }
    // )
    const client = await clientPromise;

    const db = client.db(process.env.MONGODB_DBNAME);

    const categories = await db.collection('categories')
        .find({})
        .sort({ index: 1 })
        .toArray();
    // return [{ categoryName: '뉴스', categoryLink: 'news', numOfPosts: 10 },
    // { categoryName: '루머', categoryLink: 'rumor', numOfPosts: 20 }]
    res.status(200).json(categories);
}