import Card from "./Card";
import CommonButton from "./CommonButton";
import Footer from "./Footer";

import styles from '@/styles/Sitemap.module.scss'

export default function Sitemap(props) {
  return (
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
  )
}