# Deploying the wedding invitation site (from a personal PC)

The site is already built in `dist/`. You only need Node.js (https://nodejs.org, the LTS version) and a Google account that
is an Owner or Editor of the Firebase project **vivani-wedding-celebs**.

## Publish

Open a terminal in this folder, then:

```
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

The site appears at https://vivani-wedding-celebs.web.app (Firebase console > Build > Hosting shows the exact address).
If the address is different, tell Claude so the PDFs' buttons can be pointed at it, or edit `SITE_URL` in `src/events.ts`
and rebuild (below).

If the deploy says "permission denied", open the Firebase console > Project settings > Users and permissions and add
your Google account as Owner.

## What is in here

- `dist/`  the built site (this is what gets published)
- `output/`  the PDFs: one per event plus `Vivek-Shivani-Wedding-Invitations-Complete.pdf`
- `src/events.ts`  every event's date, time, venue, Maps link and card settings; edit here to change anything
- `public/assets/`  the invitation images
- `firebase.json`, `.firebaserc`  Firebase settings (project `vivani-wedding-celebs`)

## Changing something later

```
npm install -g pnpm
pnpm install
pnpm run build          (rebuilds dist/)
firebase deploy --only hosting
```

The PDFs are rebuilt from the same event data (needs Python with `reportlab`, `pillow`):
`node scripts/export-events.mjs` then `python scripts/make_pdfs.py`. If a card's wording or artwork changed, its
picture in `output/cards/` has to be recaptured first; ask Claude to do that.
