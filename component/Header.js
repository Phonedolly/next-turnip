import Flex from "@react-css/flex";
import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect } from "react";
import { useState } from "react";
import { MdMenu, MdSearch } from 'react-icons/md'

import styles from "@/styles/Header.module.scss";
import SearchModal from "@/component/SearchModal";
import CategoryModal from "@/component/CategoryModal";



export default function Header(props) {
  const router = useRouter();
  const [headerClassName, setHeaderClassName] = useState("");

  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  // const numOfPostsAnimationControls = () => {
  //   let controls = [];
  //   for (let i = 0; i < props.categories.length; i++) {
  //     controls.push(useAnimationControls());
  //   }
  // }

  const openSearchModal = () => {
    sessionStorage.setItem("scrollYWhenModal", window.scrollY);
    setSearchModalOpen(true);

    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
    if (typeof window !== 'undefined') {
      document.body.style.cssText = "";
      window.scrollTo(0, sessionStorage.getItem("scrollYWhenModal"));
    }
  };

  const openCategoryModal = () => {
    sessionStorage.setItem("scrollYWhenModal", window.scrollY);
    setCategoryModalOpen(true);
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
  };
  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    document.body.style.cssText = "";
    window.scrollTo(0, sessionStorage.getItem("scrollYWhenModal"));
  };

  // useLayoutEffect(() => {
  //     axios.get("/api/category/getAllCategoryLength").then((res) => {
  //         setNumsOfPosts(res.data);
  //     });
  // }, []);

  // useLayoutEffect(() => {
  //   if (
  //     location.pathname === "/" ||
  //     location.pathname.startsWith("/category")
  //   ) {
  //     setHeaderClassName("header scroll");
  //   } else if (
  //     location.pathname.endsWith("/edit") &&
  //     location.pathname.split("/").length === 4
  //   ) {
  //     setHeaderClassName("header not-visible-header");
  //   } else {
  //     setHeaderClassName("header");
  //   }
  // }, []);
  return (
    <>
      <div className={`${styles['header']} ${styles['scroll']}`}>
        <div className={styles['header-content']}>
          <Link href="/" className={styles['header-link']}>
            <Flex flexDirection="row" justifyContent="start" className={styles["icon"]}>
              <div className={styles['header-text']}>Stardue64</div>
              <div className={styles['underline']} />
            </Flex>
          </Link>
          <div className={styles['menu']}>
            <div className={styles["menu-categories-explicitly"]}>
              {/* <motion.div
                                className="menu-category"
                                key={uuidv4()}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 1.0 }}
                            ></motion.div> */}
              {props.categories.map((eachMenu) => {
                return (
                  <motion.div
                    className={styles["menu-category"]}
                    key={uuidv4()}
                    whileHover={{
                      transition: { duration: 0.15 },
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.1)"
                    }}
                    whileTap={{ scale: 1.0 }}
                  >
                    <Link
                      href={`/category/${eachMenu.categoryURL}`}
                      className={styles["menu-category-link"]}
                    >
                      {eachMenu.categoryName}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <div className={styles["menu-icons"]}>
              <motion.button
                // className={`${styles['menu-icon']} ${styles['search-icon']}`}
                className={`${styles['menu-icon']}`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 1.0 }}
                onClick={openSearchModal}
              ><MdSearch size="3em" /></motion.button>
              <motion.button
                className={`${styles['menu-icon']} ${styles['category-icon']}`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 1.0 }}
                onClick={openCategoryModal}
              >
                <MdMenu size="3em" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <CategoryModal
        isModalOpen={isCategoryModalOpen}
        closeModal={closeCategoryModal}
        categories={props.categories}
      />
      <SearchModal
        isModalOpen={isSearchModalOpen}
        closeModal={closeSearchModal}
      />
    </>
  );
}

