# Contractor Worker Clone Flow

The standard process for spinning up a new version of the contractor worker
from an existing repo. Full cycle from "new repo" to "live site" in under 10 minutes.

---

## The Flow in Plain English

1. **Tell Alice** → "Create a new repo called `contractor-v006-roofing`
   cloned from `contractor-v005-dev`"
   - Alice creates the new repo
   - Alice copies all small files (wrangler.toml, admin-login-wrapper.js,
     admin-fix.txt, content-hub.js, schema.sql, seed.sql, README.md)
   - Alice renames all `v005` references to `v006` (folder name, wrangler `name =`,
     import line in admin-login-wrapper.js)
   - Alice creates the GitHub Actions deploy workflow
   - Alice leaves a placeholder `contractor-v006-roofing.js` with a paste comment

2. **You** → open Cloudflare dashboard → find the source worker → copy the full
   worker source → paste it into the new `.js` file via GitHub's web editor → commit

3. **You** → add `CLOUDFLARE_API_TOKEN` secret to the new repo:
   `Settings → Secrets and variables → Actions → New repository secret`

4. **GitHub Action fires** → site is live in ~30 seconds

5. **Log into `/admin`** → customize content → click **Publish Site Live**

6. **For isolated customer instances** → tell Claude:
   "provision isolated D1/R2/Vectorize for this customer"
   → update `wrangler.toml` with new binding IDs

---

## What Alice Does vs. What You Do

| Step | Who | Tool |
|------|-----|------|
| Create repo + scaffold files | Alice | GitHub MCP |
| Rename v00X references | Alice | GitHub MCP |
| Create deploy workflow | Alice | GitHub MCP |
| Paste big worker .js file | **You** | GitHub web editor |
| Add CLOUDFLARE_API_TOKEN secret | **You** | GitHub repo settings |
| Provision D1/R2/Vectorize (if needed) | Claude | Cloudflare MCP |

---

## What Alice Cannot Do

The main worker `.js` file (e.g. `contractor-v005-dev.js`) is typically 200KB+.
The GitHub MCP API has a per-call content size limit that makes writing large
files unreliable. Alice reads them fine but writing them back is the constraint.

**The workaround:** Alice leaves a placeholder file. You paste the source from
Cloudflare dashboard directly in GitHub's web editor — no computer required,
works on iPhone.

---

## Files Alice Renames / Updates Per Clone

| File | What changes |
|------|-------------|
| `workers/contractor-vXXX/wrangler.toml` | `name = "contractor-vXXX"` |
| `workers/contractor-vXXX/admin-login-wrapper.js` | `import app from "./contractor-vXXX.js"` |
| Folder name | `workers/contractor-vXXX/` |
| Worker placeholder | `contractor-vXXX.js` (paste target) |

Everything else (schema.sql, seed.sql, content-hub.js, admin-fix.txt) is
copied byte-for-byte with no changes.

---

## wrangler.toml Bindings Reference (current as of v005)

```toml
name = "contractor-v005-dev"
main = "admin-login-wrapper.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "V003_2_DB"
database_name = "contractor_v003_2_afo_db"
database_id = "c0743318-ee23-4d08-9bd7-0d2b3cc36018"

[[vectorize]]
binding = "V003_2_VECTORIZE"
index_name = "contractor-v003-2-afo-vector"

[[r2_buckets]]
binding = "V003_2_R2"
bucket_name = "afo-site-content"

[ai]
binding = "AI"

[[rules]]
type = "Text"
globs = ["**/*.txt"]
fallthrough = true
```

For a new isolated customer instance, Claude provisions fresh D1/R2/Vectorize
resources and replaces the IDs above.

---

## Version History

| Repo | Notes |
|------|-------|
| `contractor-v003-demo` | Original baseline |
| `contractor-v004-demo` | Upgrades from v003 |
| `contractor-v005-dev` | Clone of v004, current dev version |
| `contractor-v006-???` | Next clone — follow this doc |
