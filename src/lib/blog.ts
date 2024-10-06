import MarkdownIt from 'markdown-it';
import { getCollection } from 'astro:content';

export async function getPublishedPostsByDateDesc(max?: number) {
  const isDev = import.meta.env.DEV;

  const posts = (await getCollection('news'))
  .filter(
    // only published posts make it to production
    (post) => post.data.published || isDev
  ).sort(
    // newest posts first
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  ).slice(0, max);  // take up to max (or all if max is undefined)

  return posts;
}

const stripHtml = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

// Strips empty lines, import statements, hidden text and html tags
const cleanMdxForExcerpt = (mdx: string) => {
  let raw_lines: string[] = mdx.split('\n');
  let lines: string[] = [];
  raw_lines.forEach((line: string) => {
    line = line.trim();
    if (line != '' &&                           // empty line
        !line.startsWith('import ') &&          // import statement
        !line.startsWith('<span class="hide">') // hidden text
    ) {
      // must strip html before we render the mdx as html,
      // otherwise html tags included in the mdx will be html-encoded.
      line = stripHtml(line);
      if (line != '') {
        lines.push(line);
      }
    }
  });

  return lines.join('\n');
};

export function createExcerpt(body: string, maxChars: number) {
  let cleaned = cleanMdxForExcerpt(body);
  const parser = new MarkdownIt();
  return parser
    .render(cleaned) // render markdown as html
    .split('\n')  // split into array of lines
    .slice(0, 30) // take first 30 lines
    .map((str: string) => {
      // strip html again because we just converted the mdx to html
      let s = stripHtml(str);
      return s.split('\n'); // return array
    })
    .flat()     // concat arrays
    .join(' ')  // concat into string
    .substring(0, maxChars) // take up to maxChars
    .trim();    // trim whitespace
};
