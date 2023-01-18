import { useRouter } from "next/router";

import Card from "./Card";
import CommonButton from "./CommonButton";
import Footer from "./Footer";

import styles from '@/styles/Sitemap.module.scss'

export default function Sitemap(props) {
  const router = useRouter();
  return (
    <div className={styles['main-container']}>
      <div className={styles['card-container']}>
        {props.posts.map((each) => {
          return (
            <Card
              title={each.title}
              thumbnail={each.thumbnailURL}
              url={"/post/" + each.postURL}
              postDate={each.createdAt}
              key={each.title}
              mode="curator"
            />
          );
        })}
      </div>

      <div className={styles["buttom-navigator"]}>
        {props.sitemapIndex > 0 ?
          <CommonButton
            style={{ marginTop: "2em" }}
            onClick={() => {
              if (props.sitemapIndex === 1) {
                router.push('/');
              }
              else {
                router.push(`/${props.sitemapIndex - 1}`);
              }
            }}
          >이전</CommonButton> : null
        }
        {props.canLoadMoreSitemap === true ?
          <CommonButton
            onClick={() => {
              router.push(`/${props.sitemapIndex + 1}`);
            }}
            style={{ marginTop: "2em" }}
          >
            다음
          </CommonButton>
          : null}
      </div>
      <Footer />
    </div>
  )
}