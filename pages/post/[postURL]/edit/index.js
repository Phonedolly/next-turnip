import Writer from "@/component/Writer"
import getAllCategories from "@/lib/getAllCategories";
import { getPostsStaticPaths } from "@/lib/getPost";

export default function PostEditPage(props) {
  return <Writer {...props} isEdit={true} />
}

export async function getStaticPaths() {
  const paths = await getPostsStaticPaths();

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps() {
  const categories = await getAllCategories();

  return {
    props: {
      categories
    }
  }
}