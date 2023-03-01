import Writer from "@/component/Writer";
import getAllCategories from "@/lib/getAllCategories";

export default function WritePostPage(props) {
  return <Writer {...props} />
}

export async function getStaticProps() {
  const categories = await getAllCategories();

  return {
    props: {
      categories
    }
  }
}