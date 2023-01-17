import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Router, useRouter } from "next/router";

import commonStyles from "@/styles/Common.module.scss";
import commonModalStyles from "@/styles/CommonModal.module.scss";
import categoryModalStyles from "@/styles/CategoryModal.module.scss";

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
                    className={`${commonStyles["common-list-item"]} ${categoryModalStyles["category-item"]}`}
                    onClick={() => {
                      closeModal();
                      router.push(`/category/${eachCategory.categoryURL}`);
                    }}
                    key={uuidv4()}
                    whileHover={{
                      backgroundColor: "rgb(150, 150, 150, 0.5)",
                      // "@media (prefers-color-scheme: dark)": {
                      //   backgroundColor: "rgba(40, 40, 40, 0.7)",
                      // },
                      transition: { duration: 0.3 },
                    }}
                  >
                    {/* <img src={eachCategory.thumbnailURL} /> */}
                    <p className={categoryModalStyles["category-name"]}>{eachCategory.categoryName}</p>
                    <p className={categoryModalStyles["nums-of-posts"]}>
                      {eachCategory.numsOfPosts}개 포스트
                    </p>
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
