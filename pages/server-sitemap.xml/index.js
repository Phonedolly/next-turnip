import { getServerSideSitemap } from "next-sitemap";

import dbConnect from "@/lib/mongoose";
import Post from '@/schemas/post';

export const getServerSideProps = async (ctx) => {
  await dbConnect();
  const posts = await Post.find({});

  const fields = [{
    loc: process.env.SITE_URL || 'http://127.0.0.1:3000',
    lastmod: new Date().toISOString()
  }].concat(posts.map(post => ({
    loc: `${process.env.SITE_URL || 'http://127.0.0.1:3000'}/post/${post.postURL}`,
    lastmod: post.editedAt,
    changepreq: 'daily',
    priority: 0.7,
  })))

  return getServerSideSitemap(ctx, fields);
}

export default function SitemapIndex() { }