import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";

export default function Post({
  postData,
}: {
  postData: {
    title: string;
    id: string;
    excerpt: string;
    date: string;
    contentHtml: string;
    categories: string[];
  };
}) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
        {/* metadata */}
        <meta name="title" content={postData.title} />
        <meta name="description" content={postData.excerpt} />

        {/* og metadata */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={"https://www.example.com/posts/" + postData.id}
        />
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content={postData.excerpt} />

        {/* twitter metadata */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={postData.title} />
        <meta
          property="twitter:url"
          content={"https://www.example.com/posts/" + postData.id}
        />
        <meta property="twitter:description" content={postData.excerpt} />
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
          {" - "}
          <span className="textLight">
            {postData.categories.map((e) => (
              <Link href={`/categories/${e.toLocaleLowerCase()}`} key={e}>
                <a>{e}</a>
              </Link>
            ))}
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};
