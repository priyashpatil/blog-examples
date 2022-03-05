import Layout from "../../components/layout";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { getAllTagsIds, getPostsByTag } from "../../lib/posts";
import Link from "next/link";

export default function Tag({
  allPostsData,
}: {
  allPostsData: {
    date: string;
    id: string;
    categories: string[];
    title: string;
  }[];
}) {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Tag: {router.query.id}</title>
      </Head>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h1 className={(utilStyles.headingLg, utilStyles.capitalize)}>
          Tag: {router.query.id}
        </h1>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllTagsIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const allPostsData = await getPostsByTag(params?.id as string);
  return {
    props: {
      allPostsData,
    },
  };
};
