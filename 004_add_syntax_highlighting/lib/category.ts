import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

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
