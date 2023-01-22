import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Router, useRouter } from "next/router";

import commonStyles from "@/styles/Common.module.scss";
import commonModalStyles from "@/styles/CommonModal.module.scss";
import categoryModalStyles from "@/styles/CategoryModal.module.scss";
import Link from "next/link";

export default function CategoryModal({
  isModalOpen,
  closeModal,
  categories,
}) {

  const router = useRouter();
  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <div
            className={isModalOpen ? `${commonModalStyles["modal"]} ${categoryModalStyles["open"]}` : commonModalStyles["modal"]}
            onClick={closeModal}
          >
            <motion.section
              className={categoryModalStyles["category-modal"]}
              onClick={(e) => e.stopPropagation()}
              initial={{
                opacity: 0,
                y: window.innerHeight / 2,
              }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { ease: "anticipate", duration: 0.5 },
              }}
              exit={{
                opacity: 0,
                y: window.innerHeight / 2,
                transition: { ease: "anticipate", duration: 0.5 },
              }}
            >
              <div className={categoryModalStyles["category-list"]}>
                {categories.map((eachCategory, index) => (
                  <motion.li
                    className={`${commonStyles["common-list-item"]}`}
                    key={uuidv4()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 1.0 }}
                    transition={{ type: "keyframes", duration: 0.1 }}
                  >
                    <Link
                      href={`/category/${eachCategory.categoryURL}`}
                      onClick={() => {
                        closeModal();
                      }}
                      className={`${commonStyles['item-link']} ${categoryModalStyles['category-item']}`}
                    >
                      {/* <img src={eachCategory.thumbnailURL} /> */}
                      <h3 className={categoryModalStyles["category-name"]}>{eachCategory.categoryName}</h3>
                      <p className={categoryModalStyles["num-of-posts"]}>
                        {eachCategory.numOfPosts}개 포스트
                      </p>
                    </Link>
                  </motion.li>

                ))}
              </div>

              {/* <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.0 }}
              >
                닫기
              </motion.button> */}
            </motion.section >
          </div >
        )
        }
      </AnimatePresence >
    </>
  );
}
