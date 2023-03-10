import Image from "next/image";
import ReactMarkDown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { useState, useEffect } from "react";

import youtubeStyles from "@/styles/Youtube.module.scss";
import markdownStyles from "@/styles/GitHubMarkdownToMe.module.scss";
import postStyles from '@/styles/Post.module.scss';

import Card from "@/component/Card";

export default function Markdown(articleProps) {
  /*
  https://www.joshwcomeau.com/react/the-perils-of-rehydration/#the-solution
  */
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <ReactMarkDown
      className={markdownStyles.markdownBody}
      remarkPlugins={[remarkGfm, RemarkMathPlugin]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ className, children, ...props }) => {
          return (
            <div className={postStyles["art-hero"]}>
              <h1 className={postStyles["art-hero-title"]} {...props}>{children}</h1>
              <p className={postStyles["art-hero-date"]}>{articleProps.createdAt}</p>
            </div>
          );
        },
        div: ({ className, children, ...props }) => {
          if (className === "image-viewer") {
            return <div className={postStyles['image-viewer']}>{children}</div>;
          } else if (className === "slider-viewer") {
            return (
              <div className={postStyles['slider-viewer']}>{children}</div>
            );
          } else if (className === "link-box") {
            return (
              <Card
                title={children[1].props.children[0]}
                ogLinkSummary={children[3].props.children[0]}
                ogLinkRepresentativeUrl={children[5].props.children[0]}
                ogLinkURL={children[7].props.children[0]}
                ogThumbnail={children[9]?.props.children[0]}
                ogThumbnailSize={articleProps.imageSizes[`$${children[9]?.props.children[0]}`] || { width: 500, height: 300 }}
              />
            );
          } else if (className === "math math-display") {
            return (
              <div
                style={{
                  overflow: "hidden",
                }}
              >
                <div style={{ overflow: "auto" }}>
                  <BlockMath>{children[0]}</BlockMath>
                </div>
              </div>
            );
          } else {
            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          }
        },
        p: ({ className, children, node, ...props }) => {
          if (className === "picture-comment") {
            return (
              <p className={postStyles['picture-comment']} {...props}>
                {children}
              </p>
            );
          } else if (node.children[0].tagName === "img") {
            const image = node.children[0];
            const metastring = image.properties.alt;
            const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
            const metaWidth = metastring?.match(/{([^}]+)x/);
            const metaHeight = metastring?.match(/x([^}]+)}/);
            const width = metaWidth ? metaWidth[1] : (articleProps.imageSizes[`${image.properties.src}`]?.width || 1600);
            const height = metaHeight ? metaHeight[1] : (articleProps.imageSizes[`${image.properties.src}`]?.height || 900);
            const isPriority = metastring?.toLowerCase().match('{priority}');
            const hasCaption = metastring?.toLowerCase().includes('{caption:');
            const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

            return (
              <div className={postStyles["post-image-wrapper"]}>
                <Image
                  src={image.properties.src}
                  width={width}
                  height={height}
                  className={postStyles['post-image']}
                  alt={alt}
                />
                {hasCaption ? <div className="caption" aria-label={caption}>{caption}</div> : null}
              </div>
            )
          } else {
            return (
              <p className={className} {...props}>
                {children}
              </p>
            );
          }
        },
        img: ({ className, children, node, ...props }) => {
          const image = node;
          const metastring = image.properties.alt;
          const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
          const metaWidth = metastring?.match(/{([^}]+)x/);
          const metaHeight = metastring?.match(/x([^}]+)}/);
          const width = metaWidth ? metaWidth[1] : (articleProps.imageSizes[`${image.properties.src}`]?.width || 1600);
          const height = metaHeight ? metaHeight[1] : (articleProps.imageSizes[`${image.properties.src}`]?.height || 900);
          const isPriority = metastring?.toLowerCase().match('{priority}');
          const hasCaption = metastring?.toLowerCase().includes('{caption:');
          const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

          return (
            <Image
              src={image.properties.src}
              width={width || 500}
              height={height || 300}
              className={postStyles['post-image']}
              alt={alt}
              priority
            // fill
            // sizes="(max-width: 768px) 100vw,
            // (max-width: 1200px) 50vw,
            // 33vw"
            // style={{ overflowX: "scroll", objectFit:"contain" }}
            />
          )
        },
        span: ({ className, children, ...props }) => {
          if (className === "math math-inline") {
            return <InlineMath>{children[0]}</InlineMath>;
          } else {
            return (
              <span className={className} {...props}>
                {children}
              </span>
            );
          }
        },
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              language={match[1]}
              PreTag="div"
              {...props}
              style={github}
              showLineNumbers={true}
              wrapLongLines={true}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        /* Twitter Embed Support */
        /* https://stackoverflow.com/questions/66941072/how-to-parse-embeddable-links-from-markdown-and-render-custom-react-components */
        a: ({ inline, className, children, ...props }) => {
          if (
            props.href.startsWith("https://twitter.com") &&
            className === "embed"
          ) {
            return (
              <div>
                <TwitterTweetEmbed
                  tweetId={props.href.split("/")[5].split("?")[0]}
                />
              </div>
            ); // Render Twitter links with custom component
          } else if (
            props.href.startsWith("https://youtu.be") &&
            className === "embed"
          ) {
            return (
              <div className={youtubeStyles.videoContainer}>
                <iframe
                  src={
                    "https://www.youtube.com/embed/" + props.href.split("/")[3]
                  }
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            );
          } else if (
            props.href.startsWith("https://www.youtube.com") &&
            className === "embed"
          ) {
            return (
              <div className={youtubeStyles.videoContainer}>
                <iframe
                  src={
                    "https://www.youtube.com/embed/" +
                    props.href.split("/")[3].split("=")[1]
                  }
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            );
          } else {
            return (
              <a className={className} {...props} inline={inline}>
                {children}
              </a>
            ); // All other links
          }
        },
      }}
    >{articleProps.content}</ReactMarkDown>
  );
};
