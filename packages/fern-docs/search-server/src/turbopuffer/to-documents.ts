import { uniqBy } from "es-toolkit/array";

import { TurbopufferRecord } from "./types";

export function toDocuments(results: TurbopufferRecord[]): string[] {
  return uniqBy(
    results.map((result) => {
      return {
        chunk: result.attributes.chunk,
        title: result.attributes.title,
        pathname: result.attributes.pathname,
        hash: result.attributes.hash,
        description: result.attributes.description,
        page_position: result.attributes.page_position,
        domain: result.attributes.domain,
      };
      // const code_snippets = zipWith(
      //   result.attributes.code_snippets?.filter(
      //     (snippet) => snippet.length < 1000
      //   ) ?? [],
      //   result.attributes.code_snippet_langs?.filter(
      //     (lang) => lang.length < 1000
      //   ) ?? [],
      //   (snippet, lang) => {
      //     const lang_str: string = lang ?? "";
      //     return `\`\`\`${lang_str}\n${snippet}\n\`\`\``;
      //   }
      // ).join("\n\n");
      // return {
      //   canonicalPathname: result.attributes.canonicalPathname,
      //   chunk: result.attributes.chunk,
      //   domain: result.attributes.domain,
      //   pathname: result.attributes.pathname,
      //   hash: result.attributes.hash,
      //   title: result.attributes.title,
      //   description: result.attributes.description
      //     ? result.attributes.description + "\n\n"
      //     : "",
      //   content: result.attributes.content
      //     ? result.attributes.content + "\n\n"
      //     : "",
      //   code_snippets: code_snippets ? code_snippets + "\n\n" : "",
      //   page_position: result.attributes.page_position,
      // };
    }),
    (result) => `${result.pathname}${result.hash} - ${result.page_position}`
  ).map(
    (result) =>
      `# ${result.title}\n Citation URL: ${result.domain}${result.pathname}${result.hash ?? ""}\n\n${result.chunk}${result.description}`
  );
}
