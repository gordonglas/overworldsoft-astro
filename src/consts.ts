// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Overworld Software';
export const SITE_DESCRIPTION = 'An indie game studio working on a game engine.';
export const MAX_POSTS_NEWS_INDEX = 8;
export const MAX_POSTS_RSS  = 50;

export const appSettings = {
  company: "Overworld Software",
  formatTitle: function(pageTitle: string): string {
    return pageTitle + " - " + SITE_TITLE;
  }
};
