# Run the web app locally (agent runbook)

How an agent starts the Giddh web app on http://localhost:3000/ to test a change. Full setup,
checks and environment details are in [Development](DEVELOPMENT.md).

**No env file and no cookies are needed.** `npm start` runs [build-env.js](../scripts/build-env.js) in `local` mode. When `.env.local` is
missing, it prints `Warning: Could not load .env.local for web build` and continues with built-in
defaults: app `http://localhost:3000/`, API `https://apitest.giddh.com/`. The warning is expected.

## Steps

1. **Install dependencies** (first run, or after `package.json` changes):
   ```sh
   npm i
   ```
   No lockfile is tracked, and [.npmrc](../.npmrc) enables legacy peer resolution. Do not use
   `npm ci`. If lifecycle scripts fail (Electron, Husky), use the verified variant from
   [Development](DEVELOPMENT.md#setup-and-local-checks):
   `npm install --ignore-scripts --no-audit --no-fund`.
2. **Start the dev server:**
   ```sh
   npm start
   ```
   It generates `apps/web-giddh/src/environments/environment.generated.ts` (ignored by Git), then
   runs `ng serve web-giddh --configuration=local`. The first compile takes a few minutes. It is
   ready when the output shows `listening on localhost:3000` and `Compiled successfully`
   (verified 2026-11-28 with Node 24, no `.env.local`; `http://localhost:3000/` returned 200).
3. **Test on http://localhost:3000/.** Sign in on the local app as usual, with a test account.
   Agents never type the password: ask the user to sign in, or use a browser where they already
   are. Then check the changed flow as described in [Development](DEVELOPMENT.md#environment-and-preview).

## Things to know

- **Port 3000 in use:** stop the other server first. The port is set in the `web-giddh` serve
  target in [angular.json](../angular.json) and is also the default `APP_URL`, so do not change it.
- **UK companies hit production.** With no `.env.local`, `UK_API_URL` defaults to
  `https://gbapi.giddh.com/` (production). Do not create, edit or delete data in UK companies
  unless an approved sandbox is configured.
- **Only create `.env.local` when a task needs it** (OAuth, OTP, payments, a different API). Use
  the names in [.env.example](../.env.example) and values from the team. Never commit it or print
  its values.
