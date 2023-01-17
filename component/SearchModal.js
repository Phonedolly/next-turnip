import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import CommonInput from "@/component/CommonInput";

import commonStyles from "@/styles/Common.module.scss";
import commonModalStyles from "@/styles/CommonModal.module.scss";
import searchModalStyles from "@/styles/SearchModal.module.scss"

export default function SearchModal({ isModalOpen, closeModal }) {
  const router = useRouter();

  const [inputText, setInputText] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [searchContent, setSearchContent] = useState([]);

  useEffect(() => {
    if (inputText === "") {
      setIsAvailable(false);
      return;
    }
    axios.post("/api/search", { query: inputText }).then((res) => {
      if (res.data.length === 0) {
        return;
      }
      if (res.data) {
        setIsAvailable(true);
        setSearchContent(res.data);
      }
    });
  }, [inputText]);
  useState(() => {
    if (!isModalOpen) {
      setInputText("");
    }
  }, [isModalOpen]);

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <div
            className={isModalOpen ? `${commonModalStyles["modal"]} ${searchModalStyles["open"]}` : commonModalStyles["modal"]}
            onClick={() => {
              setInputText("");
              closeModal();
            }}
          >
            <motion.section
              className={searchModalStyles["search-modal"]}
              layout
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
              <header>원하는 제목이나 내용을 입력해보세요</header>
              <CommonInput
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
              />
              {isAvailable && (
                <>
                  <p>
                    <strong>해당 게시글의 제목이나 내용</strong>이 입력한 내용을
                    포함하고 있습니다
                  </p>
                  <div className={searchModalStyles["search-result-list"]}>
                    {searchContent.map((eachSearchItem) => (
                      <motion.li
                        className={`${commonStyles["common-list-item"]} ${commonModalStyles["item"]}`}
                        onClick={() => {
                          setIsAvailable(false);
                          setInputText("");
                          closeModal();
                          router.push(`/post/${eachSearchItem.postURL}`);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 1.0 }}
                        key={uuidv4()}
                      >
                        {/* <img src={eachSearchItem.thumbnailURL} /> */}
                        <p>{eachSearchItem.title}</p>
                      </motion.li>
                    ))}
                  </div>
                </>
              )}
              {/* <motion.button
                onClick={closeModal}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.0 }}
              >
                닫기
              </motion.button> */}
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
