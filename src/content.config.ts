import { defineCollection, reference } from "astro:content";
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

// NEW: was missing from the exported `collections` object entirely, even
// though config.yml defines an "Authors" collection at src/content/authors.
// `posts.author` references this collection (see below).
const authors = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/authors",
  }),
  schema: z.object({
    // Note: config.yml's field is labeled "Name" but its YAML key is
    // `name: title` — so the frontmatter key (and this schema property)
    // must be `title`, not `name`.
    title: z.string(),
    image: z.string(),
    // `body` (Bio) is intentionally omitted: with format: frontmatter, a
    // field literally named `body` is written as the file's Markdown body,
    // not into frontmatter — same pattern already used for staff. Access it
    // via `author.rendered?.html`, not `author.data.body`.
  }),
});

// FIXED: had no `loader` and an empty `z.object({})` schema. With no loader,
// Astro has no way to read src/content/ministries; with an empty schema,
// Zod's default "strip unknown keys" behavior would have silently discarded
// every frontmatter field (title, etc.) even if a loader were added.
const ministries = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/ministries",
  }),
  schema: z.object({
    title: z.string(),
  }),
});

// FIXED: same issue as `ministries` — no loader, empty schema.
const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    // Type-safe reference to the `authors` collection. Astro resolves this
    // via getEntry('authors', post.data.author) — see config.yml note about
    // the relation widget's value_field, which must match what's stored here.
    author: reference("authors"),
    // No `active`/`draft` fields exist yet in config.yml's posts collection.
    // Add them there (matching the staff/projects pattern) if you want
    // editorial draft support, then add draft: z.coerce.boolean().default(false) here.
  }),
});

// NEW: was missing entirely. config.yml defines a "Board" collection at
// src/content/board, but there was no matching Astro collection, so any
// board member entries created in the CMS were invisible to Astro.
const board = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/board",
  }),
  schema: z.object({
    title: z.string(), // board member's name
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/projects",
  }),
  schema: z.object({
    title: z.string(),
    photo: z.string().optional(),
    excerpt: z.string().optional(),
    // FIXED: was commented out, but config.yml's projects collection has an
    // Order field and even sorts by it (`sortable_fields`). Without this,
    // any order value set in the CMS was silently dropped on parse.
    order: z.number().optional(),
    // NEW: config.yml has a "slug" field on projects intended to control the
    // entry's URL (per its hint text), but it wasn't in the schema, so any
    // value editors entered was silently stripped.
    slug: z.string().optional(),
    // NEW: type-safe reference matching config.yml's `ministry` relation
    // field on projects.
    ministry: reference("ministries").optional(),
    active: z.coerce.boolean().default(true),
    draft: z.coerce.boolean().default(false),
    // REMOVED: `body: z.string().optional()`. Like staff's bio, the `body`
    // field is written as the file's Markdown content (not frontmatter) once
    // format: frontmatter is set, so this schema key could never actually
    // populate — use `project.rendered?.html` instead.
  }),
});

// NEW: was missing entirely. config.yml defines a "Resources" collection at
// src/content/resources with no matching Astro collection.
const resources = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/resources",
  }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  staff,
  authors,
  ministries,
  posts,
  board,
  projects,
  resources,
};
