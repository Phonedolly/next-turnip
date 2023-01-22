import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'

import styles from "@/styles/Card.module.scss";

export default function Card(props) {
  console.log(props);
  return (
    <>
      {props.mode === "curator" ? (
        <motion.div className={styles.box}
          whileHover={{ scale: 1.02, boxShadow: "rgba(0, 0, 0, 0.12) 0px 4px 16px 0px" }}
          transition={{ duration: 0.225 }}
        >
          <Link href={props.url}>
            <Image
              src={props.thumbnailUrl || "/nothing.jpg"}
              alt="썸네일"
              className={styles.thumb}
              width={300}
              height={(props.thumbnailSize.height / props.thumbnailSize.width) * 300}
              priority
            />
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.postDate}>{props.postDate}</p>
          </Link>
        </motion.div>
      ) : (
        <motion.a className={`${styles['box']} ${styles['box-in-post']}`}
          whileHover={{ scale: 1.02, boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 16px 0px" }}
          transition={{ duration: 0.225 }}
          target="_blank" rel="noreferrer"
          href={props.ogLinkURL}
        >
          {props.ogThumbnail ? (
            <Image
              src={props.ogThumbnail ?? Nothing}
              alt="썸네일"
              className={`${styles['thumb']} ${styles['thumb-in-post']}`}
              width={props.ogThumbnailSize.width}
              height={props.ogThumbnailSize.height}
              priority
            />
          ) : (
            null
          )}
          <div className={styles['text-area']}>
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.summary}>{props.ogLinkSummary.length > 192 ? `${props.ogLinkSummary.slice(0, 192)} ...` : props.ogLinkSummary}</p>
            <p className={styles.ogLinkRepresentativeUrl}>
              {props.ogLinkRepresentativeUrl}
            </p>
          </div>
        </motion.a>
      )}
    </>)
}