// src/content.config.ts
import { defineCollection, z } from "astro:content";

const staff = defineCollection({
  type: "content",
  schema: z
    .object({
      name: z.string(),
      title: z.string(),
      photo: z.string().optional(), // external URL (R2) is fine
      bio: z.string().optional(),
      order: z.number().optional(),
      draft: z.boolean().default(false),
      active: z.boolean().default(true),
    })
    .passthrough(),
});

// Minimal schemas for the other folders you already have.
// passthrough() future-proofs this until you define exact fields.
const ministries = defineCollection({
  type: "content",
  schema: z.object({}).passthrough(),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({}).passthrough(),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({}).passthrough(),
});

export const collections = {
  staff,
  ministries,
  posts,
  projects,
};
