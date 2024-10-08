import rss from '@astrojs/rss';
import {getPublishedPostsByDateDesc, createExcerpt} from '@lib/blog';
import { SITE_TITLE, SITE_DESCRIPTION, MAX_POSTS_RSS } from '@root/consts';

export async function GET(context) {
  const posts = await getPublishedPostsByDateDesc(MAX_POSTS_RSS);
  return rss({
    title: `${SITE_TITLE} - News`,
    description: SITE_DESCRIPTION,
    site: context.site,
    customData: `<generator>AstroJS</generator>`,
    trailingSlash: true,
    items: posts.map((post) => ({
      ...post.data,
      description: `${createExcerpt(post.body, 280)}...`,
      link: `/news/${post.slug}/`,
    })),
  });
}
