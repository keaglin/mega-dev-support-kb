# booking-v3 month-first hint contradicts day-first form parsing — 33 reports

## Problem and scope

The exported #4471 classifier assigns **33 unique reports** to `hint` across **3 tenants**, received **2026-04-17 through 2026-09-22**. booking-v3 prints `MM/DD/YYYY`, but the form interprets input using the tenant's day-first convention. A user following the hint can therefore get a swapped date. This is a different defect from the shared month-first parser.

Affected tenant facts and unique reports:

| Tenant | Locale | Form | Reports |
| --- | --- | --- | ---: |
| alder.physio | de-DE | booking-v3 | 12 |
| copper.studio | es-ES | booking-v3 | 11 |
| pale.harbour | pt-PT | booking-v3 | 10 |

Source ZIP: `kb-export-267efc5e.zip`, SHA-256 `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2` (export dated 2026-10-04; fresh course download matched during review).

## Evidence and reproduction scenario

- `R-41241`, `alder.physio`, form: “We had two people show up on 8 June. They were booked for 6 August.” Its browser locale is en-US, but the tenant locale is de-DE; browser metadata does not change the tenant's form semantics.
- `src/lib/kb/causes.ts:23-43` defines the booking-v3 hint as `MM/DD/YYYY` and explains that the form reads the value the tenant's way.
- To reproduce in the product: for this German booking-v3 tenant, follow the printed hint to enter `08/06/2026` for 6 August. A day-first form reads it as 8 June. Compare the hint, stored booking and generated invite. **This scenario follows the supplied model; no actual booking application is included or was executed.**

Further examples: `R-41230` (copper.studio, form) and `R-41251` (pale.harbour, form). Their intake tags both say parser even though tenant/form/channel classify them as hint.

## Counting method and exclusions

Deduplicate by report ID, filter `mergedInto === 4471`, resolve tenant locale/form through `src/lib/kb/locales.ts`, then run `causeOf` / `groupByCause` from `src/lib/kb/causes.ts`. The discriminator is **day-first tenant + form channel + booking-v3's month-first hint**. It is not subject text or `meta.browserLocale` / `meta.intakeTag`.

This issue covers **33** IDs; complete membership is in `issues/report-membership.json` under `groups[cause=hint].reportIds`. Intake tagged 18 as hint and 15 as parser. The other **379 unique reports** remain in the parser issue (`issues/parser.md`), including app/email reports from these same tenants. The two groups are disjoint and cover the 412 unique reports, not the 427 raw export rows.

## Why this needs its own ticket

The incident page claims one parser defect, but `CauseTable.svelte` computes separate causes. Alder form and app reports can have the same subject yet different causes. Copper and Morrow form reports can share a subject and channel but differ because their form versions differ. A shared-parser fix alone does not change a misleading booking-v3 field hint.

The accepted 2024 subject-only dedupe decision and triage prose are stale and contradict the executable comparisons. Preserve the historical accepted record; propose a superseding cause-based policy rather than silently editing it.

## Intended correction and acceptance

- Make the displayed hint agree with the tenant's actual date interpretation; check the saved booking and generated invite as well as the label.
- Exercise all three tenant locales with a browser locale that both matches and differs from the tenant locale. Following the displayed hint must retain the intended date.
- Cover an ambiguous month/day pair, a day greater than 12, and already-correct booking-v2 behavior.
- Verify booking-v3 app/email paths separately under the parser ticket; tenant name alone must not classify every report as hint.
- Record tested revision and release evidence. Neither filing this issue nor a “known” incident proves that a fix shipped.

Reviewed by Kevon Eaglin with GPT-6.1 Sol, 2026-10-28. See signed review at `src/routes/kb/incidents/4471-review/+page.svx` and its rendered counterpart.
