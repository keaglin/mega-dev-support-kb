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

The added review is `src/routes/kb/incidents/4471-review/+page.svx`, with computed
evidence in `src/lib/kb/Review4471.svelte`. The exported incident, accepted decision,
triage prose, report data and original components are preserved.

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

## Manual GitHub handoff

Publish this directory's source, lockfile, `issues/`, and complete `rendered/` tree
to the public repository chosen for the Challenge. Do not include `node_modules/`,
`.svelte-kit/`, or `build/`; these are reproducible, ignored local artifacts.
The surrounding course workspace and authenticated browser evidence are not part
of this handoff.

Create two actual GitHub issues using the title/body from `issues/parser.md` and
`issues/hint.md`. Markdown draft files alone are not GitHub issues.
`issues/report-membership.json` contains the disjoint ID lists behind their counts.
The KB's author signature produces desk ref `DR-D4DP-EKF1` in the rendered page.

Publication and course acceptance remain pending. After publishing, give the agent
the public repository URL and the two issue URLs so it can read them, reconcile
the latest export, and submit to the course. No GitHub mutations were performed
while preparing these local files.
