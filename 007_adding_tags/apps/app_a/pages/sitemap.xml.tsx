import { GetServerSideProps } from "next";
import { getAllCategoryIds, getSortedPostsData } from "../lib/posts";

const POSTS_ENDPOINT_URL = "https://www.example.com/posts";
const CATEGORIES_ENDPOINT_URL = "https://www.example.com/categories";

function generateSiteMap(
  posts: { id: string }[],
  categories: { id: string }[]
) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.example.com</loc>
     </url>
     ${posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`${POSTS_ENDPOINT_URL}/${id}`}</loc>
       </url>
     `;
       })
       .join("")}

      ${categories
        .map(({ id }) => {
          return `
      <url>
          <loc>${`${CATEGORIES_ENDPOINT_URL}/${id}`}</loc>
      </url>
    `;
        })
        .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await getSortedPostsData();
  const categoriesIds = await getAllCategoryIds();
  const categories = categoriesIds.map((cat) => {
    return { id: cat.params.id };
  });

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts, categories);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
