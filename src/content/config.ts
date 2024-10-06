import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Note: Obsidian Notes defaults to YYYY-MM-DD, which javascript
    // interprets wrongly. See: https://stackoverflow.com/questions/7556591/
    // Obsidian Notes format must be changed to YYYY/MM/DD under
    // Settings -> Daily notes -> Date format,
    // If you don't make the above change, the dates can be off by 1 day.
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    published: z.boolean(),
  }),
});

export const collections = { news };
