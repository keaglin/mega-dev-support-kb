# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review and local runtime

The signed review is `src/routes/kb/incidents/4471-review/+page.svx`, with computed
evidence in `src/lib/kb/Review4471.svelte`. The index, original incident and triage
page now qualify the historical guidance and link the investigation. Classifier
widgets describe export buckets rather than grant merge authority. Accepted
decision 0001, the classifier and report data remain unchanged; no replacement
policy or product fix is claimed.

[Decision 0002](src/routes/kb/decisions/0002-evidence-based-triage/+page.svx) remains proposed,
not adopted. Static evidence guidance lives in the SVX pages. `src/lib/kb/report-evidence.js`
audits complete English day/month pairs in report bodies; the review computes its cross-tab
against routing without treating either classification as production causation. Original
desk flags remain separate from broader body-evidence gaps.

Run the focused evidence-boundary checks with:

```sh
node --test src/lib/kb/report-evidence.test.js
```

From this directory, using Node 20.19+ and npm:

```sh
npm ci --no-audit --no-fund
npm run build
npm run preview -- --port 4178
```

Open `http://127.0.0.1:4178/kb/incidents/4471-review/`. This runs the actual
mdsvex/Svelte pages and original components, not a separately authored HTML mockup.

`rendered/` is the complete static build snapshot included for the desk. To view
that snapshot without installing dependencies:

```sh
python3 -m http.server 4179 --bind 127.0.0.1 --directory rendered
```

Open `http://127.0.0.1:4179/kb/incidents/4471-review/`. Keep the full `rendered/`
tree: the HTML references its CSS and JavaScript assets at the site root.

## Published tracking and local updates

The student published this directory to
[keaglin/mega-dev-support-kb](https://github.com/keaglin/mega-dev-support-kb).
For local updates, copy source, lockfile, `issues/`, and the complete rebuilt
`rendered/` tree. Exclude `node_modules/`, `.svelte-kit/`, and `build/`; these are
reproducible, ignored local artifacts. The surrounding course workspace and
authenticated browser evidence are not part of the public handoff.

Actual public tracking is [parser issue #2](https://github.com/keaglin/mega-dev-support-kb/issues/2)
and [hint issue #1](https://github.com/keaglin/mega-dev-support-kb/issues/1).
`issues/parser.md` and `issues/hint.md` retain their draft evidence and proposed
product acceptance criteria; the revised local parser draft has not been applied
automatically to the public issue. `issues/report-membership.json` contains both
the disjoint routing ID lists and a separate body-evidence audit; its original
`oneDayMove` list remains the desk's provenance, not an exhaustive uncertainty list.
The KB's author signature produces desk ref `DR-D4DP-EKF1` in the rendered page.

The course accepted the ticket stage. The desk's engineering update then reported
#4471 closed on 5 October: parser fixed (`fix(dates): parse dd/mm for eu locales`),
hint won't fix (booking-v3 form retired). Issue #2 closes as completed and #1 as
not planned on that basis; the KB records these outcomes as reported by the desk,
not as reproduced here.

## Private reverse-proxy preview

For an interactive tailnet review, use the loopback-bound Vite preview behind
Tailscale Serve. Add only the owned tailnet hostname through Vite's
`__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` environment variable when launching it;
do not disable the host allowlist or bind the preview to all interfaces.
The Python command above is the local static-snapshot viewer. The complete
`rendered/` tree remains the publishable artifact regardless of preview backend.
