import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const staff = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/staff",
  }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    photo: z.string().optional(),
    order: z.number().optional(),
    active: z.coerce.boolean().default(true),
    draft: z.coerce.boolean().default(false),
  }),
});

const ministries = defineCollection({
  schema: z.object({}),
});

const posts = defineCollection({
  schema: z.object({}),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    photo: z.string().optional(),
    // order: z.number().optional(),
    excerpt: z.string().optional(),
    body: z.string().optional(),
    active: z.coerce.boolean().default(true),
    draft: z.coerce.boolean().default(false),
  }),
});

export const collections = { staff, ministries, posts, projects };
