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

  const [post, categories] = await Promise.all([
    getPost(context.params.postURL),
    getAllCategories(),
  ]);

  const imagesWithProperty = await Promise.all(
    post.images.map(async ({ imageLocation }) => {
      console.log(imageLocation);
      return getImageSize(imageLocation)
        .then(properties => ({ src: imageLocation, properties }))
        .catch(err => {
          console.error(`target image src: ${cur}`)
          console.error(err);

          return {
            src: imageLocation,
            properties: undefined
          }
        })
    }))

  return {
    props: {
      post: {
        imageSizes: imagesWithProperty.reduce(
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