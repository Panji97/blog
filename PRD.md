# PRD — Modern Blog Platform

**Status:** Draft v1.0  
**Date:** 2026-09-08  
**Stack:** Next.js + TypeScript + SQLite + shadcn/ui

---

## 1. Ringkasan Produk

Aplikasi ini adalah platform blog modern yang terasa **premium, editorial, cepat, dan intentional** — bukan sekadar template CRUD blog.

Fokus utama:
- Pengalaman membaca yang nyaman dan imersif.
- Authoring yang cepat dan menyenangkan.
- Visual yang kuat tanpa gimmick berlebihan.
- SEO dan performance sebagai requirement inti.
- UI konsisten menggunakan shadcn/ui, tetapi dikustomisasi agar tidak terlihat seperti default shadcn.
- Arsitektur sederhana dengan SQLite untuk MVP sehingga mudah dijalankan secara lokal dan mudah dikembangkan.

### Product statement

> A refined publishing platform for people who care about writing, reading, and how their ideas are presented.

---

# 2. Tujuan Produk

## Primary Goals

1. Pengunjung dapat menemukan dan membaca artikel dengan sangat nyaman.
2. Author dapat membuat, mengedit, publish, unpublish, dan menghapus artikel.
3. Artikel memiliki URL yang bersih, SEO-friendly, dan shareable.
4. Homepage terasa seperti publication/editorial site, bukan dashboard template.
5. Admin experience sederhana tetapi efisien.
6. Aplikasi cepat pada perangkat desktop maupun mobile.
7. Visual identity terasa bespoke dan polished.

## Non-Goals untuk MVP

- Multi-author dengan permission kompleks.
- Social network / follow system.
- Comments real-time.
- Newsletter automation.
- Monetization/subscription.
- Full CMS asset management.
- Collaborative editing real-time.
- Native mobile application.

---

# 3. Target User

## 3.1 Reader

Orang yang datang untuk membaca tulisan, tutorial, opini, insight, atau dokumentasi.

**Needs**
- Cepat menemukan tulisan yang relevan.
- Bisa membaca tanpa distraksi.
- Bisa melihat konteks artikel: author, tanggal, kategori, reading time.
- Bisa share artikel.
- Navigasi antar artikel yang intuitif.

## 3.2 Author

Pemilik blog atau content creator yang menerbitkan tulisan.

**Needs**
- Menulis dengan friction rendah.
- Draft otomatis tersimpan.
- Preview sebelum publish.
- Mengelola status dan metadata artikel.
- Melihat daftar artikel secara jelas.

## 3.3 Admin

Pada MVP, author dan admin dapat berada pada role yang sama.

**Needs**
- Dashboard ringkas.
- CRUD artikel.
- Mengatur kategori/tag.
- Mengontrol SEO metadata.
- Melihat status publishing.

---

# 4. Product Principles

## 4.1 Anti-Slop Design

Jangan membuat UI yang terlihat seperti hasil generate template AI.

Rules:

- Hindari gradient berlebihan.
- Hindari glassmorphism yang tidak memiliki fungsi.
- Hindari terlalu banyak rounded cards.
- Hindari setiap section dibungkus card.
- Jangan menggunakan emoji sebagai icon UI.
- Jangan menggunakan shadow berat.
- Jangan memakai 5+ accent colors.
- Jangan membuat semua elemen terlihat "floating".
- Jangan memakai headline generik seperti "Welcome to our blog".
- Gunakan whitespace sebagai elemen desain.
- Gunakan typography hierarchy yang kuat.
- Gunakan border tipis dan subtle.
- Gunakan satu visual language yang konsisten.
- Gunakan micro-interactions hanya ketika memberi feedback atau meningkatkan navigation.

**Target visual:** editorial magazine + modern software product + independent publication.

---

# 5. Design Direction

## 5.1 Overall Feel

Keywords:

- Editorial
- Minimal
- Confident
- Premium
- Warm
- Technical
- Quietly expressive
- High contrast
- Intentional

Referensi mental model:

> Think modern independent magazine meets excellent developer blog.

Bukan:

> SaaS dashboard + generic AI landing page.

---

# 6. Visual System

## 6.1 Typography

Gunakan kombinasi:

- **Sans:** Geist / Inter-like system untuk UI.
- **Display/Editorial:** Instrument Serif / Newsreader / serif modern untuk headline besar.

Typography harus menjadi salah satu karakter utama produk.

### Recommended scale

- Display: 64–88px desktop
- H1: 48–64px
- H2: 32–40px
- H3: 24–30px
- Body: 17–19px
- Small/meta: 13–14px
- Line height body: 1.65–1.8

Mobile scale harus turun secara proporsional.

---

## 6.2 Color

Default direction: warm neutral.

```text
Background:       #F7F5F0
Foreground:       #171717
Muted foreground: #6F6B63
Border:           #DDD9D0
Surface:          #EFEBE4
Accent:           #C85A3F
White:            #FFFFFF
```

Dark mode:

```text
Background:       #11110F
Foreground:       #F3F0E8
Muted foreground: #A6A197
Border:           #302E2A
Surface:          #1A1916
Accent:           #E27659
```

Accent digunakan secukupnya untuk:
- links
- active state
- CTA
- category highlight
- small decorative details

Jangan menggunakan accent untuk seluruh UI.

---

## 6.3 Spacing

Gunakan spacing scale konsisten berbasis 4/8px.

Major sections:
- 96–160px desktop
- 64–96px tablet
- 48–72px mobile

Article content width:
- sekitar 680–760px untuk readability.

Wide editorial sections:
- sekitar 1200–1400px.

---

# 7. Information Architecture

```text
/
├── /blog
├── /blog/[slug]
├── /category/[slug]
├── /search
├── /about
├── /admin
│   ├── /admin
│   ├── /admin/posts
│   ├── /admin/posts/new
│   └── /admin/posts/[id]/edit
└── /api
    ├── /posts
    ├── /posts/[id]
    └── /search
```

Jika homepage ingin langsung menjadi publication feed, `/` dapat menjadi homepage editorial sedangkan `/blog` menjadi archive.

---

# 8. Core User Journeys

## Journey A — Read Article

```text
Homepage
→ Featured Article
→ Article Detail
→ Read
→ Related Articles
→ Next Article
```

## Journey B — Discover

```text
Homepage
→ Search / Category
→ Article Listing
→ Article Detail
```

## Journey C — Publish

```text
Admin
→ New Post
→ Write
→ Save Draft
→ Preview
→ Publish
```

## Journey D — Edit

```text
Admin
→ Posts
→ Select Post
→ Edit
→ Save
→ Preview
→ Publish / Unpublish
```

---

# 9. Public Experience

## 9.1 Homepage

Homepage harus menjadi halaman paling polished.

### Structure

```text
Header
↓
Editorial Hero
↓
Featured Story
↓
Latest Articles
↓
Category / Topic Strip
↓
Selected / Popular Articles
↓
About / Newsletter CTA (optional)
↓
Footer
```

### Header

Desktop:

```text
[Logo]      Articles   Topics   About        Search   [Admin/Login]
```

Mobile:

```text
[Logo]                          [Menu]
```

Header harus compact dan sticky hanya jika benar-benar meningkatkan usability.

### Editorial Hero

Bukan hero SaaS.

Contoh:

```text
Ideas, notes, and things
worth thinking about.

A collection of essays, technical notes,
and observations from the work behind the scenes.
```

Hero dapat memiliki:
- featured article
- oversized typography
- subtle editorial decoration
- metadata

Tidak perlu CTA besar seperti "Get Started".

---

# 10. Article Cards

Gunakan beberapa tingkat hierarchy.

## Featured Card

Large horizontal/vertical composition.

Menampilkan:
- category
- title
- excerpt
- author
- published date
- reading time
- cover image optional

## Standard Card

Compact.

```text
CATEGORY
Article title
Short excerpt
Author · Date · 6 min read
```

## Minimal List

Untuk archive:

```text
09 SEP 2026    Article Title
               Category · 8 min read
```

Minimal list penting agar blog tidak terlihat seperti kumpulan cards.

---

# 11. Article Detail Page

Ini adalah core experience.

### Structure

```text
Breadcrumb / Category

Article Title

Excerpt

Author    Date    Reading Time

Hero Image

Article Body

Tags

Share

Related Articles

Previous / Next Article
```

### Reading experience

Article body:
- max-width 720px
- font 18–20px desktop
- generous line-height
- paragraph spacing besar
- heading hierarchy jelas

Code block:
- syntax highlighting
- copy button
- horizontal scroll pada mobile

Images:
- rounded sedikit atau square depending on editorial direction
- caption support

Blockquote:
- strong left border
- serif or slightly larger typography

---

# 12. Search

Search harus cepat dan sederhana.

### UI

```text
Search articles...

Recent searches / suggestions

Results
```

Search result:

```text
Category
Article title
Excerpt
Date · Reading time
```

MVP:
- SQLite LIKE search

Future:
- FTS5
- typo tolerance
- ranking

Empty state:

> No stories found for “query”.

Jangan menggunakan empty state generik seperti "Oops! Nothing here!"

---

# 13. Category / Archive

URL:

```text
/category/[slug]
```

Header:

```text
Technology

12 stories about software,
systems, and building things.
```

List artikel berdasarkan newest first.

Filter opsional:
- category
- year
- tag

MVP cukup category + pagination/load more.

---

# 14. Admin Dashboard

Admin bukan fokus visual utama, tetapi harus sangat usable.

### Dashboard

```text
Overview

[Published] [Drafts] [Views*] [Categories]

Recent Posts
```

`Views` tidak perlu diimplementasikan pada MVP jika belum ada analytics.

### Posts table

Columns:

```text
Title
Status
Category
Published
Updated
Actions
```

Actions:

- Edit
- Preview
- Publish / Unpublish
- Delete

Bulk actions dapat ditambahkan setelah MVP.

---

# 15. Post Editor

Editor harus fokus pada writing.

## Layout

Desktop:

```text
┌─────────────────────────────────────────────┐
│ ← Posts        Save Draft     Preview Publish│
├─────────────────────────────────────────────┤
│                                             │
│ Title                                       │
│                                             │
│ Excerpt                                     │
│                                             │
│ ┌─────────────────────┐ ┌───────────────┐  │
│ │ Article editor      │ │ Post settings │  │
│ │                     │ │               │  │
│ │                     │ │ Slug          │  │
│ │                     │ │ Category      │  │
│ │                     │ │ Tags          │  │
│ │                     │ │ Cover image   │  │
│ │                     │ │ SEO title     │  │
│ │                     │ │ SEO desc      │  │
│ └─────────────────────┘ └───────────────┘  │
└─────────────────────────────────────────────┘
```

### Editor requirements

- Markdown-first atau rich text.
- Autosave draft.
- Preview.
- Character count untuk title/excerpt.
- Slug generation dari title.
- Manual slug editing.
- Keyboard-friendly.
- Unsaved changes warning.

### Recommended MVP

Gunakan Markdown sebagai canonical content format.

Benefits:
- Simple database.
- Portable content.
- Excellent for technical blogs.
- Easy rendering.
- Easy versioning later.

---

# 16. Publishing Model

Post memiliki status:

```text
draft
published
archived
```

MVP cukup:
- draft
- published

Fields:

```text
publishedAt
updatedAt
```

Publish action:
1. Validate title.
2. Validate slug.
3. Validate content.
4. Set status = published.
5. Set publishedAt jika belum ada.
6. Revalidate relevant Next.js paths.

Unpublish:
- status → draft
- publishedAt tetap dapat dipertahankan sebagai historical metadata atau di-null-kan sesuai keputusan implementasi.

---

# 17. Data Model

## User

```text
User
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt
```

Roles MVP:

```text
admin
author
```

Jika hanya single-user pada MVP, User table tetap boleh dipersiapkan untuk future expansion.

---

## Post

```text
Post
- id
- title
- slug
- excerpt
- content
- coverImage
- status
- authorId
- categoryId
- seoTitle
- seoDescription
- publishedAt
- createdAt
- updatedAt
```

Constraints:

```text
slug UNIQUE
```

---

## Category

```text
Category
- id
- name
- slug
- description
- createdAt
```

Constraints:

```text
slug UNIQUE
```

---

## Tag

```text
Tag
- id
- name
- slug
```

---

## PostTag

```text
PostTag
- postId
- tagId
```

Composite unique:

```text
(postId, tagId)
```

---

# 18. SQLite

SQLite dipilih karena:

- zero-config
- sangat cocok untuk MVP/single-instance
- mudah local development
- database file portable
- low operational overhead

Recommended:

```text
SQLite
+
Drizzle ORM
```

Drizzle tidak wajib jika ada alasan kuat untuk menggunakan Prisma, tetapi Drizzle lebih cocok untuk stack ringan ini.

---

# 19. Next.js Architecture

Gunakan Next.js App Router.

Suggested structure:

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── category/
│   │   │   └── [slug]/
│   │   ├── search/
│   │   └── about/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   └── posts/
│   │       ├── page.tsx
│   │       ├── new/
│   │       └── [id]/
│   │           └── edit/
│   │
│   └── api/
│       └── ...
│
├── components/
│   ├── ui/
│   ├── blog/
│   ├── editor/
│   └── admin/
│
├── db/
│   ├── index.ts
│   ├── schema.ts
│   └── seed.ts
│
├── lib/
│   ├── posts.ts
│   ├── categories.ts
│   ├── search.ts
│   ├── seo.ts
│   └── utils.ts
│
└── styles/
```

---

# 20. shadcn/ui Usage

Gunakan shadcn/ui sebagai foundation, bukan sebagai final visual identity.

Components yang kemungkinan digunakan:

- Button
- Input
- Textarea
- Dialog
- Dropdown Menu
- Sheet
- Select
- Badge
- Table
- Tabs
- Tooltip
- Alert Dialog
- Command
- Skeleton
- Toast/Sonner

### Customization

Default shadcn radius/colors harus disesuaikan dengan design system.

Contoh prinsip:

```text
radius: medium / subtle
shadow: minimal
border: low contrast
buttons: compact
cards: use sparingly
```

Public website tidak boleh terasa seperti shadcn demo.

---

# 21. Responsive Design

## Desktop

Target:
- 1280px+
- editorial whitespace
- 2-column compositions jika diperlukan

## Tablet

Target:
- 768–1279px
- reduce gutters
- preserve typography hierarchy

## Mobile

Target:
- 320–767px
- single column
- 16–20px side padding
- readable article width
- sticky editor controls jika diperlukan

### Mobile priorities

1. Reading
2. Navigation
3. Search
4. Sharing
5. Admin

---

# 22. Accessibility

Minimum WCAG 2.1 AA principles.

Requirements:
- semantic HTML
- keyboard navigation
- visible focus state
- sufficient contrast
- alt text for images
- aria-label pada icon-only controls
- headings ordered correctly
- skip-to-content link
- form errors understandable
- no information conveyed by color alone

---

# 23. SEO

Setiap post harus memiliki:

```text
title
description
canonical URL
Open Graph metadata
Twitter/X metadata
```

Generate:

```text
sitemap.xml
robots.txt
```

Article structured data:

```text
Article / BlogPosting JSON-LD
```

URL format:

```text
/blog/clean-readable-slug
```

Jangan gunakan ID sebagai public URL.

---

# 24. Performance

Targets:

- Fast initial load.
- Minimal client-side JavaScript pada public pages.
- Server Components by default.
- Client Components hanya ketika interactivity diperlukan.
- Optimized images.
- Lazy loading images di bawah fold.
- Static generation/revalidation untuk published posts jika memungkinkan.

Public blog harus terasa instant.

Avoid:
- giant UI libraries
- unnecessary client state
- excessive animation libraries
- loading everything on page load

---

# 25. Animation & Interaction

Motion harus subtle.

Allowed:
- hover underline
- image scale 1–2%
- fade/slide small elements
- command palette transitions
- drawer/dialog transitions

Avoid:
- parallax everywhere
- bouncing cards
- large page transitions
- cursor-follow effects
- animated gradients
- excessive blur

Rule:

> If the animation is noticeable before the content, it is probably too much.

---

# 26. Image Direction

Cover images tidak wajib untuk semua post.

Jika digunakan:
- editorial photography
- abstract technical visuals
- diagrams
- illustrations
- screenshots

Avoid generic AI-looking hero images.

Aspect ratio recommended:
- 16:9
- 3:2
- 4:3

Use consistent crop behavior.

---

# 27. Empty / Loading / Error States

## Loading

Gunakan skeleton hanya pada area yang benar-benar loading.

Jangan membuat seluruh halaman menjadi skeleton.

## Empty

Contoh:

> No articles yet.

Subtext:

> Published stories will appear here.

## Error

Contoh:

> Something went wrong while loading this story.

CTA:

> Try again

Copy harus human, bukan generic developer error.

---

# 28. API / Server Actions

Untuk MVP, prefer Server Actions untuk admin mutations.

Operations:

```text
createPost()
updatePost()
deletePost()
publishPost()
unpublishPost()
createCategory()
updateCategory()
deleteCategory()
```

Read operations dapat langsung menggunakan server-side data access.

API routes hanya dibuat jika dibutuhkan external consumers.

---

# 29. Authentication

MVP membutuhkan protected admin area.

Requirements:
- Login
- Logout
- Session
- Protected `/admin/*`
- Password hashing
- HTTP-only session cookie

Jangan menyimpan password plaintext.

Jika single-user deployment, auth dapat dibuat sesederhana mungkin tetapi tetap aman.

---

# 30. Security

Minimum:

- Validate semua input server-side.
- Sanitize/render Markdown dengan aman.
- Prevent XSS dari article content.
- CSRF protection sesuai authentication approach.
- Rate limit login endpoint.
- Jangan expose database credentials/secrets.
- Jangan mempercayai role dari client.
- Authorization harus dilakukan server-side.

---

# 31. Analytics

MVP:

Tidak wajib.

Future:
- page views
- top articles
- traffic source
- reading completion
- referrer
- search queries

Analytics harus privacy-conscious.

---

# 32. Content Rules

Setiap artikel:

Required:
- title
- slug
- content
- status

Recommended:
- excerpt
- category
- cover image
- tags
- SEO title
- SEO description

Title guideline:
- jelas
- spesifik
- tidak clickbait berlebihan

Excerpt:
- 1–2 kalimat
- menjelaskan value artikel

---

# 33. Seed Data

Development seed harus berisi minimal:

### Categories

```text
Technology
Design
Ideas
Notes
```

### Example posts

Minimal 8–12 artikel dummy yang realistis.

Jangan gunakan:

```text
Lorem ipsum
Test post
Hello world
Sample article
```

Dummy content harus terasa seperti konten blog sungguhan agar visual QA bermakna.

---

# 34. Definition of Done — MVP

## Public

- [ ] Homepage responsive
- [ ] Article archive
- [ ] Article detail
- [ ] Category page
- [ ] Search
- [ ] Related articles
- [ ] Previous/next navigation
- [ ] Responsive header
- [ ] Footer
- [ ] Dark mode optional
- [ ] SEO metadata
- [ ] Sitemap
- [ ] Robots
- [ ] Open Graph

## Admin

- [ ] Login
- [ ] Dashboard
- [ ] Posts list
- [ ] Create post
- [ ] Edit post
- [ ] Delete post
- [ ] Draft status
- [ ] Publish
- [ ] Unpublish
- [ ] Preview
- [ ] Category management
- [ ] Tags
- [ ] SEO fields

## Technical

- [ ] Next.js App Router
- [ ] TypeScript
- [ ] SQLite
- [ ] Drizzle ORM
- [ ] shadcn/ui
- [ ] Server Components by default
- [ ] Server-side validation
- [ ] Secure authentication
- [ ] Mobile responsive
- [ ] Accessibility baseline
- [ ] No obvious console errors
- [ ] Production build passes

---

# 35. Acceptance Criteria

## Homepage

**Given** a visitor opens `/`

**When** the page loads

**Then**
- featured article is visible
- latest articles are visible
- navigation is understandable
- page renders correctly on mobile
- metadata is readable
- there are no layout shifts caused by images

---

## Read Article

**Given** a published article exists

**When** visitor opens `/blog/[slug]`

**Then**
- article title is rendered
- content is readable
- author/date/reading time are shown
- metadata is SEO-friendly
- article can be shared
- related articles are shown

---

## Draft

**Given** author is logged in

**When** author creates a new post

**Then**
- post can be saved as draft
- draft does not appear publicly
- author can reopen and continue editing

---

## Publish

**Given** a valid draft exists

**When** author clicks Publish

**Then**
- status changes to published
- publishedAt is populated
- post appears in public listing
- public URL works
- Next.js cache/revalidation updates the relevant pages

---

## Delete

**Given** author has an existing post

**When** author chooses Delete

**Then**
- confirmation is shown
- post is removed only after confirmation
- public page returns not found if previously published

---

# 36. Design QA Checklist

Sebelum dianggap selesai, lakukan visual QA pada:

- 1440px desktop
- 1280px desktop
- 1024px tablet
- 768px tablet
- 390px mobile
- 320px mobile

Check:

- typography
- spacing
- overflow
- image cropping
- navigation
- buttons
- form states
- empty states
- loading states
- long titles
- long category names
- long article content
- code blocks
- dark mode jika diaktifkan

---

# 37. Anti-Slop Review

Sebelum release, jawab pertanyaan berikut:

### Visual

- Apakah halaman terlihat seperti template AI?
- Apakah terlalu banyak card?
- Apakah semua elemen rounded?
- Apakah ada terlalu banyak gradient?
- Apakah accent color terlalu dominan?
- Apakah typography punya karakter?
- Apakah whitespace digunakan secara intentional?

### Content

- Apakah copy terasa manusia?
- Apakah headline spesifik?
- Apakah empty state meaningful?
- Apakah metadata konsisten?

### UX

- Apakah user tahu harus klik apa?
- Apakah reading experience tenang?
- Apakah admin flow cepat?
- Apakah mobile experience sama baiknya?

Jika jawaban terhadap pertanyaan pertama adalah "ya", redesign sebelum release.

---

# 38. Suggested Development Phases

## Phase 1 — Foundation

- Next.js setup
- TypeScript
- Tailwind/shadcn
- SQLite
- Drizzle
- DB schema
- seed
- design tokens

## Phase 2 — Public Blog

- layout
- homepage
- article archive
- article page
- category
- search
- SEO

## Phase 3 — Admin

- auth
- dashboard
- posts CRUD
- editor
- categories
- publishing

## Phase 4 — Polish

- responsive QA
- accessibility
- performance
- animation
- empty/loading/error states
- metadata
- visual refinement

## Phase 5 — Production

- environment config
- database backup strategy
- security review
- deployment
- monitoring

---

# 39. Recommended Tech Stack

```text
Framework       Next.js
Language        TypeScript
Styling         Tailwind CSS
UI              shadcn/ui
Database        SQLite
ORM             Drizzle ORM
Validation      Zod
Auth            Auth.js / lightweight secure session solution
Markdown        MDX or Markdown renderer
Icons           Lucide
Fonts           Geist + editorial serif
Deployment      Node-compatible platform
```

Do not add dependencies unless they solve a concrete product requirement.

---

# 40. Final Product Vision

Blog ini tidak seharusnya terasa seperti:

> "Saya membuat CRUD blog dengan Next.js."

Blog ini harus terasa seperti:

> "Ini adalah publication yang benar-benar ingin saya baca."

Technical simplicity berada di belakang layar.

Di depan layar, pengguna merasakan:
- typography yang kuat
- layout yang tenang
- content hierarchy yang jelas
- loading yang cepat
- navigation yang effortless
- visual detail yang intentional

**North Star:**

> **Less UI. More editorial character. Better reading.**
