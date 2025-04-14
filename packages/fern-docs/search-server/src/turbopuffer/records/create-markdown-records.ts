import { createHash } from "crypto";

import { FernTurbopufferRecordWithoutVector } from "../types";
import { BaseRecord } from "./create-base-record";

interface CreateMarkdownRecordsOptions {
  base: BaseRecord;
  markdown: string;
}

// TODO: the `<If>` component is not supported, and will show up in search results!
export async function createMarkdownRecords({
  base,
  markdown,
}: CreateMarkdownRecordsOptions): Promise<
  FernTurbopufferRecordWithoutVector[]
> {
  // console.log("Base URL: ", base.attributes.pathname);
  // console.log("Markdown length: ", markdown.length);
  // Function to split markdown into chunks of approximately 10000 characters
  const splitMarkdownIntoChunks = async (
    text: string,
    maxChunkSize: number = 7000
  ): Promise<string[]> => {
    if (text.length <= maxChunkSize) {
      return [text];
    }

    const chunks: string[] = [];
    let currentPosition = 0;

    // Process all chunks except potentially the last one
    while (currentPosition + maxChunkSize < text.length) {
      // Try to find a natural break point (newline) near the chunk size
      let breakPoint = currentPosition + maxChunkSize;

      // Look for the nearest paragraph break
      const nextParagraph = text.indexOf("\n\n", breakPoint - 500);
      if (nextParagraph !== -1 && nextParagraph < breakPoint + 500) {
        breakPoint = nextParagraph + 2; // Include the newlines
      } else {
        // If no paragraph break, look for any newline
        const nextNewline = text.indexOf("\n", breakPoint - 200);
        if (nextNewline !== -1 && nextNewline < breakPoint + 200) {
          breakPoint = nextNewline + 1;
        }
      }

      chunks.push(text.substring(currentPosition, breakPoint));
      currentPosition = breakPoint;
    }

    // Handle the last chunk - ensure it's also maxChunkSize in length by including overlap
    if (currentPosition < text.length) {
      const startPosition = Math.max(0, text.length - maxChunkSize);
      chunks.push(text.substring(startPosition));
    }

    return chunks;
  };

  const chunked_content = await splitMarkdownIntoChunks(markdown);
  return chunked_content.map((chunk, i) => {
    return {
      ...base,
      id: createHash("sha256").update(`${base.id}-${i}`).digest("hex"),
      attributes: {
        ...base.attributes,
        chunk,
        page_position: i + 1,
      },
    };
  });

  // /**
  //  * If the title is not set in the frontmatter, use the title from the sidebar.
  //  */
  // const data_title = markdownToString(data.title);
  // const title = data_title != null ? decode(data_title) : base.attributes.title;

  // // meta descriptions will be pre-pended to the content
  // const metaDescriptions = [
  //   data.description,
  //   data.subtitle ?? data.excerpt,
  //   data["og:description"],
  // ];

  // // collect all meta descriptions along with the content
  // const description = [...metaDescriptions]
  //   .filter(isNonNullish)
  //   .map((text) => text.trim())
  //   .filter((text) => text.length > 0)
  //   .join("\n\n");

  // const { content: prepared_content, code_snippets: prepared_code_snippets } =
  //   maybePrepareMdxContent(content);

  // const code_snippets = flatten(
  //   compact([
  //     base.attributes.code_snippets,
  //     prepared_code_snippets?.map((c) => c.code),
  //   ])
  // );

  // const code_snippet_langs = flatten(
  //   compact([
  //     base.attributes.code_snippet_langs,
  //     prepared_code_snippets?.map((c) => c.lang ?? ""),
  //   ])
  // );

  // const chunked_content = flatten(
  //   await Promise.all([
  //     description ? splitText(description) : [],
  //     prepared_content ? splitText(prepared_content) : [],
  //     ...code_snippets.map((code) => splitText(code)),
  //   ])
  // );

  // const base_markdown_record: BaseRecord = {
  //   ...base,
  //   attributes: {
  //     ...base.attributes,
  //     keywords: data.keywords,
  //     title,
  //     description,
  //     code_snippets: code_snippets.length > 0 ? code_snippets : undefined,
  //     code_snippet_langs:
  //       code_snippet_langs.length > 0 ? code_snippet_langs : undefined,
  //   },
  // };

  // return chunked_content.map((chunk, i) => {
  //   return {
  //     ...base_markdown_record,
  //     id: createHash("sha256")
  //       .update(`${base_markdown_record.id}-${i}`)
  //       .digest("hex"),
  //     attributes: {
  //       ...base_markdown_record.attributes,
  //       chunk,
  //       page_position: i + 1,
  //     },
  //   };
  // });
}
