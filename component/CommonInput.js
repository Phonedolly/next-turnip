import styles from "@/styles/CommonInput.module.scss"

export default function CommonInput(props) {
  return <input className={styles["common-input"]} {...props} />;
}