# After-parity backlog

Ideas agreed for **after** the new app matches the old one (parity first). Not scheduled yet.

- **Mask retailer account details.** Show emails, card/phone digits and notes as dots by
  default, with a per-card eye icon to reveal; re-mask when leaving the screen. No password
  (the data is already on the device, and a password would add friction 20–30×/day). Face ID
  "unlock to reveal" belongs in the future Swift app, where it's native.
- **Comment cleanup pass.** After cutover, go through the codebase and remove every comment
  that isn't essential, keeping only non-obvious "why" notes (workarounds, security rules).
- **Enforce valid conditions in the database.** After cutover (when the old app's free-text name
  field can no longer write), add a database rule matching the app's: NM/LP/MP/HP/DMG, or
  PSA/BGS/CGC/SGC/TAG with a grade from 1 to 10 in half steps.
- **One card per sealed product per hold (first after cutover).** Adding or moving a product
  into a hold that already has it (same name, ignoring case and spaces) merges into that card:
  quantity, cost and PAS fees add up; the existing card's quarter values are kept; the earliest
  purchase date wins; the absorbed row is soft-deleted so sales history still links. Edit blocks
  a rename that would create a duplicate ("Already in this hold — use Add to increase qty").
  Change lives in the database functions; check production for existing duplicates first.
