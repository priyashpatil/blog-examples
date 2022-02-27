import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeFormat from "rehype-format";
import rehypeHighlight from "rehype-highlight";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData(): {
  date: string;
  id: string;
  categories: string[];
  title: string;
}[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
      categories: matterResult.data.categories ?? ["Uncategorized"],
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds(): { params: { id: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id: string): Promise<{
  date: string;
  title: string;
  id: string;
  excerpt: string;
  contentHtml: string;
  categories: string[];
}> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await unified()
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkToc, { tight: true, ordered: true }) // Generates table of contents
    .use(remarkRehype)
    .use(rehypeHighlight, { subset: false })
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        code: [
          ...(defaultSchema.attributes?.code || []),
          // List of all allowed languages:
          [
            "className",
            "hljs",
            "language-js",
            "language-jsx",
            "language-css",
            "language-md",
            "language-shell",
          ],
        ],
        span: [
          ...(defaultSchema.attributes!.span || []),
          [
            "className",
            "hljs-addition",
            "hljs-attr",
            "hljs-attribute",
            "hljs-built_in",
            "hljs-bullet",
            "hljs-char",
            "hljs-code",
            "hljs-comment",
            "hljs-deletion",
            "hljs-doctag",
            "hljs-emphasis",
            "hljs-formula",
            "hljs-keyword",
            "hljs-link",
            "hljs-literal",
            "hljs-meta",
            "hljs-name",
            "hljs-number",
            "hljs-operator",
            "hljs-params",
            "hljs-property",
            "hljs-punctuation",
            "hljs-quote",
            "hljs-regexp",
            "hljs-section",
            "hljs-selector-attr",
            "hljs-selector-class",
            "hljs-selector-id",
            "hljs-selector-pseudo",
            "hljs-selector-tag",
            "hljs-string",
            "hljs-strong",
            "hljs-subst",
            "hljs-symbol",
            "hljs-tag",
            "hljs-template-tag",
            "hljs-template-variable",
            "hljs-title",
            "hljs-type",
            "hljs-variable",
          ],
        ],
      },
    })
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(rehypeFormat)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    excerpt: matterResult.data.excerpt ?? "Priyash Patil Blog",
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
    categories: matterResult.data.categories ?? ["Uncategorized"],
  };
}

export function getCategorySortedPostsData(category: string): {
  date: string;
  id: string;
  categories: string[];
  title: string;
}[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
      categories: matterResult.data.categories ?? ["Uncategorized"],
    };
  });

  const filteredPosts = allPostsData.filter((e) => {
    const categories: string[] = e.categories;

    const mappedCategories = categories.map((cat) => {
      return cat.toLocaleLowerCase();
    });

    return mappedCategories.includes(category.toLocaleLowerCase());
  });

  // Sort posts by date
  return filteredPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllCategoryIds(): { params: { id: string } }[] {
  const categoryIds: Set<string> = new Set(["Uncategorized"]);
  const fileNames = fs.readdirSync(postsDirectory);

  fileNames.forEach((fileName) => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const postCategories: string[] = matterResult.data.categories ?? [];
    postCategories.forEach((cat) => {
      categoryIds.add(cat);
    });
  });

  return Array.from(categoryIds).map((cat) => {
    return {
      params: {
        id: cat.toLocaleLowerCase(),
      },
    };
  });
}
