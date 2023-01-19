import Head from 'next/head'
import stringUrlExtractor from 'string-url-extractor';
import getImageSize from 'image-size-from-url';

import getAllCategories from '@/lib/getAllCategories'
import { getPost, getPostsStaticPaths } from '@/lib/getPost'

// import CommonButton from '@/component/CommonButton'
import Header from '@/component/Header'
import Markdown from '@/component/Markdown'

import outlineStyles from '@/styles/Sitemap.module.scss'
import postStyles from '@/styles/Post.module.scss'
import Footer from '@/component/Footer'

export default function Post(props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={process.env.BLOG_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header categories={props.categories} />
        <div className={outlineStyles['main-container']}>
          <Markdown {...props.post} />
          {/* {isLoggedIn === "YES" && (
            <div className={styles["edit-button-container"]}>
              <CommonButton
                onClick={() => {
                  navigate("/post/" + props.postURL + "/edit");
                }}
                className={`${styles["art-edit-button"]} ${styles["common-button"]}`}
              >
                수정하기
              </CommonButton>
            </div>
          )} */}
        </div>
        <Footer />
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const paths = await getPostsStaticPaths();

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const formats = ["jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "apng", "gif", "webp", "avif", "ico", "tiff", "svg", "bmp", ,];

  const post = await getPost(context.params.postURL);
  const categories = await getAllCategories();
  const initialValue = [];
  const imageLinks = await stringUrlExtractor(post.content)
    .reduce(async (prev, cur) => {
      const prevResult = await prev.then();

      let isImageUrl = false;
      formats.forEach(eachFormat => {
        if (cur.toLowerCase().slice(cur.lastIndexOf(".") + 1) === eachFormat) {
          isImageUrl = true;
        }
      })

      if (isImageUrl === true) {
        const properties = await getImageSize(cur);
        prevResult.push({ src: cur, properties });
      }

      return Promise.resolve(prevResult);
    }, Promise.resolve([]))
  return {
    props: {
      post: {
        imageSizes: imageLinks.reduce(
          (prev, cur) => {
            prev[cur.src] = cur.properties
            return prev;
          }, {}),
        ...post
      },
      categories
    }
  }
}