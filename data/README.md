# data/

Pipeline experimentation and data validation. It's Python, separate from the Next.js app, and the app never imports anything from here. (Not to be confused with `lib/constants/`, which holds the app's static lookups.)

The site's reference data (facilities, field offices, courts, local orgs, county coverage) comes from a curated spreadsheet, the **Sheet of Record**. Scripts here validate it and load it into Supabase, and the app reads it from there through `server/queries.ts`.

| Path | What it is |
|---|---|
| `publish_local_orgs.py` | Loads the Sheet of Record's `local_orgs` tab into Supabase. Runs a dry run (diff + preview CSV) unless you pass `--push`. |
| `make_publish.py`, `publish_to_supabase.py` | Build the family-facing publish CSV from the master sheet and upsert it. |
| `update_xlsx/` | Sheet of Record versions, backups and preview CSVs. **Gitignored.** |
| `parquets/` | ICE arrest/detention data and the analysis used to rank the "facilities to call" list. **Gitignored.** |

Run the scripts from the repo root (for example `python3 data/publish_local_orgs.py`). They read credentials from the repo's `.env` and never print them. Ask Christina before running anything with `--push`, since it writes to the production database.
