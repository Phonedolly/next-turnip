import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Link from "next/link";

import CommonInput from "@/component/CommonInput";

import commonStyles from "@/styles/Common.module.scss";
import commonModalStyles from "@/styles/CommonModal.module.scss";
import searchModalStyles from "@/styles/SearchModal.module.scss"
import { useQuery } from "react-query";


export default function SearchModal({ isModalOpen, closeModal }) {
  const { status, refetch, isError, data, error } = useQuery("searchPost", () => {
    setIsSearching(true);
    return axios.post(`/api/search`, { query: inputText })

  }, {
    enabled: false,
    refetchOnWindowFocus: false,
    retry: 0
  });
  const router = useRouter();

  const [isSearching, setIsSearching] = useState(false);
  const [isResultAvailable, setIsResultAvailable] = useState(false);
  const [inputText, setInputText] = useState("");
  const [searchContent, setSearchContent] = useState([]);

  useEffect(() => {
    if (inputText.length === 0) {
      setSearchContent([]);
      setIsResultAvailable(false);
      return;
    }
    else {
      refetch();
    }
  }, [inputText, refetch]);

  useEffect(() => {
    if (status === 'success' && data.data.searchResult.length > 0) {
      setSearchContent(data.data.searchResult);
      setIsResultAvailable(true);
    }
    setIsSearching(false);
  }, [status, data])

  useState(() => {
    if (!isModalOpen) {
      setInputText("");
    }
  }, [isModalOpen]);

  return (
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
            {status === "loading" || isSearching === true ?
              <p><strong>검색 중입니다...</strong></p> : null}
            {status === "success" && isSearching === false && isResultAvailable === true ? (
              <>
                <p>
                  <strong>해당 게시글의 제목이나 내용</strong>이 입력한 내용을
                  포함하고 있습니다
                </p>
                <div className={searchModalStyles["search-result-list"]}>
                  {searchContent.map((eachSearchItem) => (
                    <motion.li
                      className={`${commonStyles["common-list-item"]}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 1.0 }}
                      transition={{ type: "keyframes", duration: 0.1 }}
                      key={uuidv4()}
                    >
                      <Link href={`/post/${eachSearchItem.postURL}`}
                        onClick={() => {
                          setIsAvailable(false);
                          setSearchContent([]);
                          setInputText("");
                          closeModal();
                        }}
                        className={commonStyles['item-link']}>
                        {/* <Image
                          className={searchModalStyles['thumbnail']}
                          alt="Search Item Thumbnail"
                          src={eachSearchItem?.thumbnailURL || '/nothing.jpg'}
                          width={eachSearchItem.thumbnailSize?.width / 3 || 1920 / 3}
                          height={eachSearchItem.thumbnailSize?.height / 3 || 1357 / 3}
                          priority /> */}
                        <p>{eachSearchItem.title}</p>
                      </Link>
                    </motion.li>
                  ))}
                </div>
              </>
            ) : null}
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
  );
}
