# Editing your site content

**Everything on the site lives in this folder as plain text files.** You never
need to touch code to change what the site shows. Edit a file here, save, and the
site updates.

Two ways to edit:

1. **In a browser form** — go to `/admin` on your site (or run the local CMS,
   see the main README). This is the easy way; it's a form, no JSON.
2. **By hand** — open the `.json` files below in any text editor.

If you edit by hand, keep the punctuation exactly as it is: every `"` , `,` and
`{ }` matters. After saving, run `npm run validate` — it tells you the file and
field if something is wrong, in plain words.

---

## The files

| File | What it controls |
|------|------------------|
| `profile.json` | Your name, title, one-line pitch, bio, photo, email, phone, résumé link |
| `skills.json` | Skill groups and the skills inside them |
| `projects.json` | Every project card and its detail page |
| `experience.json` | Education entries and any work/volunteer roles |
| `certificates.json` | Every certificate, with a category for filtering |
| `achievements.json` | Awards and competitions |
| `social.json` | Links to GitHub, LinkedIn, etc. |
| `settings.json` | Accent colour, dark/light default, section order, section on/off, contact form key |

---

## Two fields are on almost every item

- **`order`** — a number. Lower numbers show first. To move an item, change its
  number. They don't have to be 1,2,3 — `10, 20, 30` works and leaves room.
- **`visible`** — `true` or `false`. Set it to `false` to hide an item without
  deleting it.

**If you empty a whole list** (e.g. remove every achievement), that section and
its menu link disappear automatically. No blank section is left behind.

---

## How to… add a project

Open `projects.json`. It looks like:

```json
{
  "projects": [
    { ...project one... },
    { ...project two... }
  ]
}
```

Copy one whole `{ ... }` block, paste it as a new item in the list (mind the
comma between blocks), and change the fields:

```json
{
  "title": "My New Project",
  "slug": "my-new-project",
  "summary": "One sentence shown on the card.",
  "description": "A longer write-up. This becomes the project's own page.\n\nLeave it empty or starting with 'TODO' and the card will link straight to GitHub instead of opening a page.",
  "tags": ["Machine Learning", "Python"],
  "techStack": ["Python", "Pandas"],
  "role": "Project Developer",
  "githubUrl": "https://github.com/you/repo",
  "liveUrl": "",
  "image": "",
  "featured": false,
  "order": 7,
  "visible": true
}
```

Rules:
- **`slug`** must be lowercase words joined by hyphens. It becomes the web address
  `/projects/my-new-project`, so it must be unique.
- **`image`** — leave `""` for none, or put a file in `public/images/` and write
  `"/images/yourfile.jpg"`. Cards and pages look fine with no image.
- **`liveUrl`**, **`githubUrl`** — leave `""` if there isn't one.
- **`featured: true`** makes the card bigger and sorts it first.
- A new project's detail page is created automatically. Nothing else to do.

## How to… add a certificate

Open `certificates.json`, copy an item, change the fields:

```json
{
  "title": "Course Name",
  "issuer": "Who issued it",
  "date": "May 2025",
  "credentialUrl": "https://link-to-certificate",
  "category": "AI/ML",
  "logo": "/images/logos/issuer.svg",
  "order": 13,
  "visible": true
}
```

**Logos on the certificate cards.** Well-known providers (Google Cloud,
Microsoft, Coursera, Udemy, edX, HCL) show their real logo automatically — no
setup. For any other issuer (NPTEL, a college, GUVI, …) the card shows a small
text badge unless you give it a `logo`: drop an SVG or PNG into
`public/images/logos/` and set `"logo": "/images/logos/nptel.svg"`. Use logo
files you're allowed to use (official media/press kits, or the issuer's own
site). Leave `logo` off and the text badge is used.

`category` is free text, but reuse the existing ones — `AI/ML`, `Design`,
`Business`, `Web`, `Marketing` — so the filter buttons stay tidy. A brand-new
category name automatically gets its own filter button.

## How to… change the Skills headline

`skills.json` has an optional `intro` block at the top:

```json
"intro": {
  "eyebrow": "Toolkit",
  "title": "Skills that turn data into decisions.",
  "blurb": "A short sentence under the headline."
}
```

Edit those three strings, or delete the whole `intro` block — the section still
works with sensible defaults. The rotating logo orbit is built automatically
from your skill names (the ones with a known logo show first); nothing to set.

## How to… reorder or hide sections

Open `settings.json`, find `"sections"`:

```json
"sections": [
  { "id": "about",        "label": "About",        "order": 1, "visible": true },
  { "id": "skills",       "label": "Skills",       "order": 2, "visible": true },
  { "id": "projects",     "label": "Projects",     "order": 3, "visible": true },
  ...
]
```

- Change `order` numbers to reorder the whole page (and the menu).
- Set `visible` to `false` to switch a section off completely.
- `label` is the wording in the top menu.
- Don't change `id` — that's the internal name.

## How to… change the accent colour

Open `settings.json`:

```json
"theme": {
  "accent": "#b64826",
  "accentContrast": "#ffffff"
}
```

Put any hex colour in `accent`. It's used for links, buttons, highlights, focus
outlines and the social-card image — everywhere, in both light and dark mode.
`accentContrast` is the text colour that sits **on top of** the accent (usually
white or near-black); pick whichever is readable on your accent.

## How to… turn the contact form on

Get a free access key from [web3forms.com](https://web3forms.com) (or a form ID
from [formspree.io](https://formspree.io)), then in `settings.json`:

```json
"contact": {
  "provider": "web3forms",
  "accessKey": "paste-your-key-here"
}
```

Until you do this, the form politely tells visitors to email you instead.

---

## If the build complains

Run `npm run validate`. Example message:

```
✖ content/projects.json
    projects › 2 › slug: slug must be lowercase kebab-case, e.g. my-project
```

That means: in `projects.json`, the **3rd** project (counting from 0), the
`slug` field is wrong. Fix that one thing and run it again.
