import Flex from "@react-css/flex";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { useState } from "react";
// import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";

import useUnload from "@/hook/useUnload"
// import getAllCategories from "@/lib/getAllCategories";
import { onLoginSuccess } from "@/lib/client/login";

// import "./Common.scss";
// import "./Writer.scss";
import writerStyles from '@/styles/Writer.module.scss'

import Markdown from "@/component/Markdown";
import CommonInput from "@/component/CommonInput";
import CommonButton from "@/component/CommonButton";

export default function Writer(props) {
  console.log(props);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [_id, set_id] = useState("");
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [thumbURL, setThumbURL] = useState("");
  const [md, setMd] = useState("");
  const [images, setImages] = useState([]);
  const [imageSizes, setImageSizes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const router = useRouter();
  const { status, data, error, isLoading } = useQuery("silentRefresh",
    () => axios.get('/api/auth/silentRefresh', { withCredentials: true }).then(({ data }) => {
      console.log(data)
      if (data.isSilentRefreshSuccess === true) {
        onLoginSuccess(data.accessToken);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      return data
    }),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      retry: 0
    }
  );

  useEffect(() => {
    async function getMd() {
      await axios.post("/api/getPost/", { postURL: router.query.postURL })
        .then(
          (res) => {
            set_id(res.data.postData._id);
            setTitle(res.data.postData.title);
            setNewTitle(res.data.postData.title);
            setMd(res.data.postData.content);
            if (res.data.category) {
              setSelectedCategory(res.data.postData.category);
            }
            setThumbURL(() => res.data.postData.thumbnailURL);

            res.data.postData.images?.forEach((eachImage) => {
              const imageData = {
                imageLocation: eachImage.imageLocation,
                imageName: eachImage.imageName,
                isThumb: eachImage.imageLocation === res.data.thumbnailURL,
              };
              setImages((prevImages) => prevImages.concat(imageData));
            });

            /* 썸네일이지만 본문에 쓰이지 않은 이미지를 images에 추가 */
            let thereIsThumbAndMd = false; // 썸네일과 본문에 동시에 쓰인 이미지는 없을 것이다
            res.data.postData.images.forEach((eachImage) => {
              if (eachImage.imageLocation === res.data.postData.thumbnailURL) {
                thereIsThumbAndMd = true; // 썸네일이지만 본문에 쓰인 이미지를 발견했다
              }
            });
            if (!thereIsThumbAndMd) {
              const token = res.data.postData.thumbnailURL?.split("/");

              if (token) {
                setImages((images) => {
                  const newCond = [
                    {
                      imageLocation: res.data.postData.thumbnailURL,
                      imageName: token[token.length - 1],
                      isThumb: true,
                    },
                  ].concat(images);
                  return newCond;
                });
              }
            }
          },
          (err) => {
            console.error(err);
          }
        );
    }

    async function importArticle() {
      const naverArticle = await axios
        .post("/api/import", {
          clubID: params.clubID,
          articleNumber: params.articleNumber,
        })
        .then(({ data }) => ({
          importTitle: data.title,
          images: data.images,
          mdContent: data.mdContent,
        }))
        .then(({ importTitle, mdContent, images }) => {
          setTitle(() => importTitle);
          images.forEach((image, index) => {
            image.isThumb = index === 0 ? true : false;
            setImages((prevImages) => prevImages.concat(image));
          });
          setMd(mdContent);
        });
    }
    if (status === "success" &&
      data.isSilentRefreshSuccess === true &&
      router.query.postURL) {
      setLoggedIn(true)
      onLoginSuccess(data.accessToken);
      console.log(`onLoginSuccess`)
      if (props.isEdit) {
        getMd();
      } else if (props.isImport) {
        importArticle();
      }
    } else {
      setLoggedIn(false);
    }
  }, [router.query, props.isEdit, props.isImport, props.importURL, status, data?.accessToken, data?.isSilentRefreshSuccess]);

  useEffect(() => {
    console.log(props.categories);
    if (props.categories.length > 0 && !(selectedCategory?._id)) {
      setSelectedCategory(props.categories[0])
    }
  }, [props.categories, selectedCategory])

  const handleImageInput = async (e) => {
    // const formData = new FormData();
    // formData.append("filename", e.target.files[0].name);
    // formData.append("img", e.target.files[0]);
    const file = e.target.files?.[0];
    const fileName = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type)

    axios.post(`/api/uploadImage`, {
      fileName,
      fileType,
    }).then(({ data }) => {
      const { url, fields } = data;
      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value)
      })

      axios.post(`${url}`, formData).then(async ({ data }) => {
        console.log(`Uploaded!`);

        const imageLocation = `${url}${fields.key}`
        const imageName = `${fields.key.slice(fields.key.lastIndexOf('/') + 1)}`
        const imageSize = await axios.post('/api/getImageSize', { imageLocation }).then(({ data }) => data.properties);

        setImages((prevImages) => {
          if (prevImages.length === 0) {
            setThumbURL(imageLocation);
          }
          const newCond = prevImages.concat({
            imageLocation,
            imageName,
            isThumb: prevImages.length === 0 ? true : false,
          });


          setImageSizes(prev => {
            return {
              ...prev,
              [imageLocation]: imageSize
            }
          })
          return newCond;
        });
      }).catch(e => {
        console.error(`Image Upload Error!`);
        console.error(e);
      })
    }).catch((e) => {
      console.error(`Image Upload Error!`);
      console.error(e);
    })
    // axios
    //   .post("/api/uploadImage", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then(
    //     (res) => {
    //       setImages((images) => {
    //         const newCond = images.concat({
    //           imageLocation: res.data.imageLocation,
    //           imageName: res.data.imageName,
    //           isThumb: images.length === 0 ? true : false,
    //         });
    //         if (images.length === 0) {
    //           setThumbURL(res.data.imageLocation);
    //         }
    //         return newCond;
    //       });
    //     },
    //     (err) => {
    //       alert("이미지 업로드 실패");
    //     }
    //   );
  };

  const handleThumb = (e) => {
    const srcUrl = e.target.src;
    images.forEach((eachImage, n) => {
      if (eachImage.isThumb) {
        setImages((original) => {
          const newCond = [].concat(original);
          newCond[n].isThumb = false;
          return newCond;
        });
      }
      if (eachImage.imageLocation === srcUrl) {
        setImages((original) => {
          const newCond = [].concat(original);
          newCond[n].isThumb = true;
          return newCond;
        });
        setThumbURL(eachImage.imageLocation);
      }
    });
  };

  const handleSetTab = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      let val = e.target.value;
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      e.target.value = val.substring(0, start) + "\t" + val.substring(end);
      e.target.selectionStart = e.target.selectionEnd = start + 1;
      setMd(e.target.value);
      return false; //  prevent focus
    }
  };

  const handleUpload = async () => {
    if (!title) {
      alert("제목이 없습니다");
      return;
    }
    const imageBlacklist = [];
    const imageWhitelist = [];
    images.forEach((eachImage) => {
      if (
        !md.includes(eachImage.imageLocation) &&
        thumbURL !== eachImage.imageLocation
      ) {
        imageBlacklist.push({ Key: eachImage.imageName });
      } else {
        imageWhitelist.push({
          imageLocation: eachImage.imageLocation,
          imageName: eachImage.imageName,
        });
      }
    });
    console.log(imageBlacklist)
    axios
      .post(`/api/publish`, {
        _id: _id,
        title: title,
        newTitle: props.isEdit ? newTitle : null,
        content: md,
        thumbnailURL: thumbURL || null,
        imageWhitelist: imageWhitelist,
        imageBlacklist: imageBlacklist,
        category: selectedCategory,
        isEdit: props?.isEdit ? true : false
      })
      .then(
        (res) => {
          // removeBeforeUnload();
          router.replace(`/`);
        },
        (err) => {
          console.error(err);
          console.error("Post Upload Error");
        }
      );
  };

  useUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const mdErrorHandler = ({ error, resetErrorBoundary }) => {
    return (
      <div role="alert">
        <p>지원하지 않는 동작입니다.</p>
        <p>마지막으로 입력한 문자: {md[md.length - 1]}</p>
        <button className="writer-button" onClick={() => resetErrorBoundary()}>
          다시 시도
        </button>
      </div>
    );
  };

  const saveTempData = () => {
    localStorage.setItem(
      "tempData",
      JSON.stringify({ title: title, images: images, md: md })
    );
    alert("임시 저장 되었습니다");
  };

  const LoadTempData = () => {
    const tempData = JSON.parse(localStorage.getItem("tempData"));
    if (tempData) {
      setTitle(tempData.title);
      setImages(tempData.images);
      setMd(tempData.md);

      alert("임시 저장 데이터를 불러왔습니다");
    } else {
      alert("저장된 데이터가 없습니다");
    }
  };
  const removeTempData = () => {
    localStorage.removeItem("tempData");
    alert("임시 저장 데이터를 지웠습니다.");
  };

  /* https://velog.io/@hwanieee/textarea-%EC%9E%90%EB%8F%99-%EB%86%92%EC%9D%B4-%EC%A1%B0%EC%A0%88
   */
  const autoResizeTextarea = () => {
    let textarea = document.querySelector(".inputTextArea");

    if (textarea) {
      textarea.style.height = "auto";
      let height = textarea.scrollHeight; // 높이
      textarea.style.height = `${height + 8}px`;
    }
  };

  if (status === "success" &&
    data.isSilentRefreshSuccess === true) {
    return (
      <>
        <Flex column className={writerStyles["writer-container"]}>
          <Flex row justifySpaceBetween alignItemsCenter>
            <CommonInput
              placeholder="제목"
              value={props.isEdit ? newTitle : title}
              onInput={(e) => {
                if (props.isEdit) {
                  setNewTitle(e.target.value);
                } else {
                  setTitle(e.target.value);
                }
              }}
              style={{ width: "50%" }}
            />
            <CommonButton onClick={saveTempData} className={writerStyles["writer-button"]}>
              임시 저장
            </CommonButton>
            <CommonButton onClick={LoadTempData} className={writerStyles["writer-button small-text"]}>
              임시 저장<br></br>불러오기
            </CommonButton>
            <CommonButton
              onClick={removeTempData}
              className={writerStyles["writer-button small-text"]}
            >
              임시 데이터<br></br>지우기
            </CommonButton>
            <select
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              defaultValue={selectedCategory}
              key={selectedCategory}
            >
              {props.categories?.map((eachCategory) => (
                <option key={uuidv4()} value={eachCategory._id}>
                  {eachCategory.categoryName}
                </option>
              ))}
            </select>
            <button onClick={handleUpload} className={writerStyles["writer-button"]}>
              업로드
            </button>
          </Flex>
          <textarea
            placeholder="썸네일 URL"
            className={writerStyles["inputThumbnailArea"]}
            value={thumbURL}
            onInput={(e) => {
              setThumbURL(e.target.value);
            }}
          />
          <div>
            <div className={writerStyles["imageGroup"]}>
              {images.map((eachImage) => (
                <Flex column key={uuidv4()} className={writerStyles["uploadedImageBox"]}>
                  <Image
                    src={eachImage.imageLocation}
                    className={writerStyles["uploadedImage"]}
                    alt={eachImage.imageLocation}
                    onClick={handleThumb}
                    width={100}
                    height={100}
                  />
                  <pre disabled>{eachImage.imageLocation}</pre>
                  {eachImage.isThumb && <p>대표</p>}
                </Flex>
              ))}
            </div>
          </div>
          <input type="file" accept="image/*" onChange={handleImageInput} />
          <div className={writerStyles["inputAndMd"]}>
            <textarea
              placeholder="내용을 입력하세요"
              className={writerStyles["inputMdArea"]}
              value={md}
              onChange={(e) => {
                setMd(e.target.value);
                autoResizeTextarea();
              }}
              onKeyDown={(e) => {
                handleSetTab(e);
                autoResizeTextarea();
              }}
            />
            <div className={writerStyles["showTextArea"]}>
              <ErrorBoundary
                FallbackComponent={mdErrorHandler}
              // onReset={() => {
              //   setMd((prevMd) => prevMd.slice(0, prevMd.length - 1));
              // }}
              >
                <Markdown content={md} imageSizes={imageSizes} />
              </ErrorBoundary>
            </div>
          </div>
        </Flex>
      </>
    );
  } else if (status === "success" &&
    data?.data.isSilentRefreshSuccess === false) {
    router.replace('/');
  } else {
    return <div>기다리세요</div>;
  }
}
