import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'

import styles from "@/styles/Card.module.scss";


export default function Card(props) {
  return (
    <>
      {props.mode === "curator" ? (
        <motion.div className={styles.box}
          whileHover={{ scale: 1.02, boxShadow: "rgba(0, 0, 0, 0.12) 0px 4px 16px 0px" }}
          transition={{ duration: 0.225 }}
        >
          <Link href={props.url}>
            <Image
              src={props.thumbnail || "/nothing.jpg"}
              alt="썸네일"
              className={styles.thumb}
              width={500}
              height={3}
              priority
            />
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.postDate}>{props.postDate}</p>
          </Link>

        </motion.div>
      ) : (
         <motion.div className={styles.box}
          whileHover={{ scale: 1.02, boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 16px 0px" }}
          transition={{ duration: 0.225 }}
        >
          <a href={props.ogLinkURL} target="_blank" rel="noreferrer">
            {props.ogThumbnail ? (
              <Image
                src={props.ogThumbnail ?? Nothing}
                alt="썸네일"
                className={styles.thumb}
              />
            ) : (
              <></>
            )}
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.summary}>{props.ogLinkSummary}</p>
            <p className={styles.ogLinkRepresentativeUrl}>
              {props.ogLinkRepresentativeUrl}
            </p>
          </a>

        </motion.div>
      )}
    </>)
}