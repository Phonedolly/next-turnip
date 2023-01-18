import Head from 'next/head'

import getAllCategories from '@/lib/getAllCategories'
import { getAllPosts, getSitemapIndicesAfterFirstPage } from '@/lib/getSitemap'

import Header from '@/component/Header'
import Sitemap from '@/component/Sitemap'

export default function OtherHome(props) {
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
  const sitemapIndices = await getSitemapIndicesAfterFirstPage();

  return {
    paths: sitemapIndices,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const categories = await getAllCategories();
  const { posts, canLoadMoreSitemap } = await getAllPosts(Number(context.params.sitemapIndex));

  return {
    props: {
      categories,
      posts,
      sitemapIndex: Number(context.params.sitemapIndex),
      canLoadMoreSitemap
    }
  }
}