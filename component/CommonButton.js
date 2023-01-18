import { motion } from "framer-motion";

import styles from "@/styles/Common.module.scss";

export default function CommonButton(props) {
  return (
    <motion.button
      className={styles["common-button"]}
      whileHover={{ scale: 1.02, boxShadow: "rgba(0, 0, 0, 0.12) 0px 4px 16px 0px" }}
      transition={{ duration: 0.225 }}
      {...props}
    >
      {props.children}
    </motion.button>
  );
}
