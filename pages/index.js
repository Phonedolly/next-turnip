import Head from 'next/head'

import getAllCategories from '@/lib/getAllCategories'
import { getAllPosts } from '@/lib/getSitemap'

import Header from '@/component/Header'
import Sitemap from '@/component/Sitemap'

export default function Home(props) {
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

export async function getStaticProps() {
  const [categories, [posts, canLoadMoreSitemap]] = await Promise.all([
    getAllCategories(),
    getAllPosts(0)
  ])

  return {
    props: {
      categories,
      posts,
      sitemapIndex: 0,
      canLoadMoreSitemap
    }
  }
}