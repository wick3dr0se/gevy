# Gevy

**Gevy** is an open-source social platform for developers, powered by **Astro**, **TailwindCSS**, **Supabase**, and deployed on **Vercel**

## Stack Used

- **[Astro](https://astro.build/)** — Fast, modern frontend framework
- **[TailwindCSS](https://tailwindcss.com/)** — Utility-first styling
- **[Supabase](https://supabase.com/)** — Auth, DB, and real-time backend
- **[Vercel](https://vercel.com/)** — Fast global deployments

## Project Structure

```text
/
├── public/              # Static assets (favicon, logos, etc.)
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Shared page layouts
│   ├── pages/           # Astro routes
│   ├── lib/             # Supabase + GitHub API + helpers
└── package.json
```

## Getting Started (Self Hosting)

1. Clone & install

```bash
git clone https://github.com/wick3dr0se/gevy
cd gevy
npm install
```

2. Setup Supabase
   Create a new [Supabase](https://supabase.com/) project, then copy your credentials into .env, like:

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

(You'll find these in Project Settings → API)

3. Run locally

```bash
npm run dev
```

Then visit http://localhost:8080

## Contributing

Issues, PRs, feedback are all welcome.. All help is much appreciated. Only preferences:

- Format the code (Prettier)
- Follow conventional commits (chore:, feat:, fix:)

Maintained with ❤️ by [Open Source Force](https://github.com/opensource-force/)
