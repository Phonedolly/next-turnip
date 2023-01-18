import Head from 'next/head'

import getAllCategories from '@/lib/getAllCategories'
import { getPostsOnFirstPage } from '@/lib/getSitemap'

import Card from '@/component/Card'
import CommonButton from '@/component/CommonButton'
import Header from '@/component/Header'
import Footer from '@/component/Footer'


import styles from '@/styles/Home.module.scss'


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
        <div className={styles['main-container']}>
          <div className={styles['card-container']}>
            {props.posts.map((each) => {
              return (
                <Card
                  title={each.title}
                  thumbnail={each.thumbnailURL}
                  url={"/post/" + each.postURL}
                  postDate={each.postDate}
                  key={each.title}
                  mode="curator"
                />
              );
            })}
          </div>
          {(props.canLoadMoreSitemap === true) && (
            <div className={styles["buttom-navigator"]}>
              <CommonButton
                onClick={() => {

                }}
                style={{ marginTop: "2em" }}
              >
                다음
              </CommonButton>
            </div>
          )}
          <Footer />
        </div>
      </main>
    </>
  )
}


export async function getStaticProps(context) {

  const categories = await getAllCategories();
  const { posts, canLoadMoreSitemap } = await getPostsOnFirstPage();
  return {
    props: {
      categories,
      posts,
      canLoadMoreSitemap
    }
  }
}