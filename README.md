# Rescue Mission

Install dependencies with `npm ci`. Copy `.env.example` to `.env.local` and set
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXTAUTH_SECRET` before signing in to
Mission Control. Generate a session secret with
`node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
Use separate credentials and the public site URL for deployments.

For a new local PostgreSQL database, run `node scripts/setup-db.mjs`, then start
the site with `npm run dev`. Open the homepage once to initialize the settings
table. To populate starter page content in a new local database, run
`node scripts/migrate-settings.mjs` followed by `node scripts/migrate-social.mjs`.
Maintenance scripts read configuration from the shell environment. Set their
database connection variables explicitly if using a custom database.

Programs and gallery entries use site settings. Legacy table entries are used
when the corresponding settings list has never been saved. An existing
settings list takes precedence, including an intentionally empty list.
