# Manikandan P — Portfolio

> **AI & Data Science Student | Python Developer | Machine Learning Enthusiast**

A modern, responsive personal portfolio website built to showcase my **projects, technical skills, certifications, achievements, education, and experience** in Artificial Intelligence and Data Science.

The portfolio uses a **data-driven content architecture**, where most website content is managed through JSON files instead of being hardcoded into components.

---

## 🚀 Live Portfolio

🌐 **Website:** [Add your live portfolio URL]

💻 **GitHub:** https://github.com/Manikandan-777

---

## ✨ Features

* 🎨 Modern and responsive portfolio design
* 🌙 Light and dark mode
* ⚡ Smooth animations and interactive UI
* 📱 Mobile-friendly design
* 🧠 AI & Data Science project showcase
* 🏆 Certifications and achievements section
* 💼 Education and experience section
* 📊 Data-driven content using JSON
* 🔍 Filterable projects and certificates
* 📄 Resume section
* 📬 Contact form
* 🔗 Social and professional links
* ♿ Accessibility-focused UI
* 🔎 SEO-friendly metadata
* 🗺️ Automatic sitemap and robots.txt
* 📦 Static project detail pages
* 🛠️ Optional Decap CMS integration
* ✅ Content validation using Zod

---

## 🛠️ Tech Stack

### Frontend

* **Next.js 15**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**

### Data & Validation

* **JSON**
* **Zod**

### CMS

* **Decap CMS**

### Deployment

* **GitHub Pages** (via GitHub Actions)

---

## 📂 Project Structure

```text
manikandan-portfolio/
│
├── content/
│   ├── profile.json
│   ├── skills.json
│   ├── projects.json
│   ├── experience.json
│   ├── certificates.json
│   ├── achievements.json
│   ├── social.json
│   ├── settings.json
│   └── README.md
│
├── public/
│   ├── images/
│   ├── admin/
│   └── resume.pdf
│
├── src/
│   ├── app/
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── opengraph-image.tsx
│   │
│   ├── components/
│   │   ├── Nav
│   │   ├── ThemeProvider
│   │   ├── ThemeToggle
│   │   ├── ScrollProgress
│   │   ├── Reveal
│   │   ├── Section
│   │   ├── SocialLinks
│   │   ├── Footer
│   │   ├── ProjectCard
│   │   ├── ProjectsBrowser
│   │   ├── CertificatesBrowser
│   │   └── ContactForm
│   │
│   ├── sections/
│   │   ├── Hero
│   │   ├── About
│   │   ├── Skills
│   │   ├── Projects
│   │   ├── Certificates
│   │   ├── Achievements
│   │   └── Contact
│   │
│   └── lib/
│       ├── schema.ts
│       ├── content.ts
│       └── utils.ts
│
├── scripts/
│   └── validate-content.ts
│
├── .github/workflows/deploy.yml
├── package.json
└── README.md
```

---

## 🧩 Data-Driven Content

The portfolio separates **content from application logic**.

All major portfolio information is stored inside the `/content` directory.

For example:

```text
content/
├── profile.json
├── skills.json
├── projects.json
├── experience.json
├── certificates.json
├── achievements.json
├── social.json
└── settings.json
```

This makes it possible to update the portfolio without modifying React components.

### Example

Adding a new project only requires updating:

```text
content/projects.json
```

The website automatically renders the project.

Each list item supports:

```json
{
  "order": 1,
  "visible": true
}
```

This allows content to be:

* Reordered
* Hidden
* Added
* Edited
* Removed

without changing component code.

---

## 🔐 Content Validation

All JSON content is validated using **Zod**.

The validation system helps catch incorrect or missing fields before deployment.

Run:

```bash
npm run validate
```

Example validation error:

```text
✖ content/certificates.json
certificates › 4 › category: Required
```

This identifies the file, item, field, and validation problem.

Content validation also runs automatically during:

```bash
npm run build
```

---

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Manikandan-777/manikandan-portfolio.git
```

### 2. Navigate to the project

```bash
cd manikandan-portfolio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command            | Description                       |
| ------------------ | --------------------------------- |
| `npm run dev`      | Start the development server      |
| `npm run build`    | Create a production build         |
| `npm run start`    | Start the production server       |
| `npm run validate` | Validate all JSON content         |
| `npm run lint`     | Run ESLint                        |
| `npm run cms`      | Start the local Decap CMS backend |

---

## 🎨 Design

The portfolio focuses on a clean and professional developer experience.

### Typography

* **Fraunces** — Display typography
* **Inter** — Body typography

### Theme

* Light mode
* Dark mode
* Custom accent color
* Persistent theme preference

### Motion

Animations are implemented using **Framer Motion** with a focus on subtle:

* Scroll animations
* Hover interactions
* Page transitions

The interface also respects:

```text
prefers-reduced-motion
```

---

## ♿ Accessibility

The portfolio is designed with accessibility in mind.

Features include:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Skip navigation
* Descriptive image alt text
* Accessible interactive elements
* WCAG-oriented color contrast
* Reduced-motion support

---

## 📝 Updating Portfolio Content

Most portfolio updates can be made without touching the source code.

### Update profile

```text
content/profile.json
```

### Add or edit skills

```text
content/skills.json
```

### Add a project

```text
content/projects.json
```

### Add certificates

```text
content/certificates.json
```

### Add achievements

```text
content/achievements.json
```

### Update social links

```text
content/social.json
```

### Configure portfolio settings

```text
content/settings.json
```

See:

```text
content/README.md
```

for the detailed content-editing guide.

---

## 🗂️ Project Pages

Projects can have individual detail pages:

```text
/projects/project-slug
```

Project routes are automatically generated from:

```text
content/projects.json
```

using Next.js `generateStaticParams`.

If a project does not contain a meaningful description, the project card can link directly to its GitHub repository instead of displaying an incomplete detail page.

---

## 🛠️ Decap CMS

The portfolio optionally supports **Decap CMS** for easier content editing.

Start the local CMS with:

```bash
npm run cms
```

Then run the development server separately:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/admin
```

The CMS edits the same JSON files inside `/content`.

The portfolio can still be maintained manually without using the CMS.

---

## 🚀 Deployment

The project is configured for automated deployment to **GitHub Pages** via GitHub Actions.

The repository includes:

```text
.github/workflows/deploy.yml
```

### Enable GitHub Pages in your Repository

1. Go to your repository on GitHub (`Manikandan-777/Manikanda`).
2. Navigate to **Settings** → **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push any commit to the `main` branch: the GitHub Actions workflow will automatically build the static Next.js site and deploy it to GitHub Pages at:

```text
https://manikandan-777.github.io/Manikanda/
```

### Production URL Configuration

The production URL is configured in:

```text
content/settings.json
```

```json
{
  "siteUrl": "https://manikandan-777.github.io/Manikanda"
}
```

The URL is used for SEO-related features such as:

* Canonical URLs
* Sitemap
* Robots.txt
* Open Graph metadata

---

## ⚠️ Before Going Live

Replace all placeholder content before deploying.

| Item                 | Location                    |
| -------------------- | --------------------------- |
| Resume               | `public/resume.pdf`         |
| Project descriptions | `content/projects.json`     |
| Project images       | `public/images/`            |
| Certificate links    | `content/certificates.json` |
| Contact form key     | `content/settings.json`     |
| Website URL          | `content/settings.json`     |
| Social links         | `content/social.json`       |

---

## 📌 Featured Areas

### 🤖 Artificial Intelligence & Machine Learning

My portfolio focuses on projects and learning in:

* Machine Learning
* Deep Learning
* Computer Vision
* Natural Language Processing
* Generative AI
* Data Science

### 💻 Development

Technologies and tools include:

* Python
* TensorFlow
* Scikit-learn
* Pandas
* NumPy
* OpenCV
* Next.js
* React
* TypeScript
* Tailwind CSS
* Flask
* Django
* SQL
* MongoDB

---

## 👨‍💻 About Me

I'm **Manikandan P**, an Artificial Intelligence & Data Science student interested in building practical solutions using **Python, Machine Learning, Deep Learning, and modern web technologies**.

I enjoy working on projects that combine AI with real-world applications and continuously improving my technical and problem-solving skills.

---

## 📫 Connect With Me

* **GitHub:** [Manikandan-777](https://github.com/Manikandan-777)
* **LinkedIn:** [Manikandan P](https://www.linkedin.com/in/manikandan-p-695516343/)
* **Portfolio:** [Add your live website URL]

---

## 📄 License

This project is primarily intended to showcase my personal portfolio and work.

You are welcome to explore the code for learning and reference. Please do not present my personal information, projects, or portfolio content as your own.

---

⭐ **If you find this portfolio interesting, consider giving the repository a star!**

**Built with ❤️ by Manikandan P**
