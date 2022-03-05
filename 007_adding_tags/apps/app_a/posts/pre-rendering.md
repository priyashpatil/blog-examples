---
title: "Two Forms of Pre-rendering"
date: "2020-01-01"
excerpt: "Next.js has two forms of pre-rendering: Static Generation and Server-side Rendering. The difference is in **when** it generates the HTML for a page."
tags:
  - ssr
  - ssg
  - next.js
  - react
---

## Table of contents

## Sub heading

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

### List head

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.

Example code:

```js
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import rehypeFormat from "rehype-format";

const processedContent = await unified()
  .use(remarkParse)
  .use(remarkToc, { tight: true, ordered: true })
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeSlug)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process("fileContents");
```

## Sub heading 2

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.
