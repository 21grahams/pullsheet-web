# After-parity backlog

Ideas agreed for **after** the new app matches the old one (parity first). Not scheduled yet.

- **Backend comment cleanup.** Frontend done (2026-10-06). After cutover, as part of retiring
  `legacy_*`, trim backend comments to non-obvious "why" notes (never edit applied migrations;
  do it in the retirement migration, scripts and README).
- **Enforce valid conditions in the database.** After cutover (when the old app's free-text name
  field can no longer write), add a database rule matching the app's: NM/LP/MP/HP/DMG, or
  PSA/BGS/CGC/SGC/TAG with a grade from 1 to 10 in half steps.
- **One card per sealed product per hold (first after cutover).** Adding or moving a product
  into a hold that already has it (same name, ignoring case and spaces) merges into that card:
  quantity, cost and PAS fees add up; the existing card's quarter values are kept; the earliest
  purchase date wins; the absorbed row is soft-deleted so sales history still links. Edit blocks
  a rename that would create a duplicate ("Already in this hold — use Add to increase qty").
  Change lives in the database functions; check production for existing duplicates first.
- **Rename the app** (before any App Store/Swift release). Name idea: "Pulled". Includes the
  custom domain, GitHub repo names, and tidying the Mac folders at the same time (`~/Pullsheet`
  vs `~/pullsheet-web`): moving the backend folder means updating the nightly backup job's paths,
  the practice setup, and Claude's per-project notes together.
- **Face ID to reveal account details** (Swift app). The web app masks details behind a tap with
  no password, since a password would add friction 20–30×/day; Face ID makes a real lock cheap.
