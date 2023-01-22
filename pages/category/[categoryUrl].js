import Head from 'next/head'

import getAllCategories from '@/lib/getAllCategories'
import { getAllPosts, } from '@/lib/getSitemap'
import { getSitemapByCategory } from '@/lib/getSitemapByCategory'

import Header from '@/component/Header'
import Sitemap from '@/component/Sitemap'
import { getCategoryId } from '@/lib/getCategoryId'


export default function CategoryHome(props) {
  return (
    <>
      <Head>
        <title>{process.env.BLOG_NAME}</title>
        <meta name="description" content={process.env.BLOG_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header categories={props.categories} />
        <Sitemap {...props} />
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const sitemapByCategory = await getSitemapByCategory();

  return {
    paths: sitemapByCategory,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const [categories, currentCategoryId] = await Promise.all([
    getAllCategories(),
    getCategoryId(context.params.categoryUrl)
  ])
  const [posts, canLoadMoreSitemap] = await getAllPosts(0, currentCategoryId);

  return {
    props: {
      categories,
      posts,
      sitemapIndex: 0,
      canLoadMoreSitemap,
      viewCategory: true,
      categoryUrl: context.params.categoryUrl
    }
  }
}