# Shared month-first date parser swaps day-first tenant dates — 379 reports

## Problem and scope

The exported #4471 classifier assigns **379 unique reports** to `parser` across **11 tenants**, received **2026-04-01 through 2026-10-04**. The supplied model describes a shared month-first parser receiving day-first tenant input. These are routing and snapshot claims, not independently confirmed causes or a claim about a later live queue.

Source ZIP: `kb-export-267efc5e.zip`, SHA-256 `267efc5ea61aca6efaaca842160ac4d0377d56bcbf5123e61c604d6ae99597f2` (export dated 2026-10-04; fresh course download matched during review).

## Evidence and reproduction scenario

- `R-41203`, `lantern.row`, app: “Booked for 2 December. The invite says 12 February.” The tenant is `cs-CZ`, booking-v2.
- The exported model in `src/lib/kb/causes.ts:23-43` says the shared parser reads month first. A day-first tenant's `02/12/2026`, intended as 2 December, is therefore interpreted as 12 February.
- To reproduce in the product: use that tenant/path, enter the intended day-first date, and compare the saved booking and generated invite to the intended date. **This scenario follows the supplied model; the product parser and application runtime are not included and were not executed.**

The parser bucket includes day-first tenants' app/email reports, including booking-v3 tenants, and form reports where the hint is already day first. The **33 booking-v3 form-hint reports are excluded** and need their own fix (`issues/hint.md`).

## Counting method

1. Deduplicate `src/lib/data/reports-4471.json` using `uniqueById` from `src/lib/kb/causes.ts:50-53`.
2. Keep reports whose `mergedInto === 4471`.
3. Resolve tenant locale/form from `src/lib/data/tenants/*.json` through `src/lib/kb/locales.ts`.
4. Use `causeOf` / `groupByCause`, not subject wording, browser locale or `meta.intakeTag`.

The source has **427 rows / 412 unique IDs**; overlapping pages contribute **15 duplicate rows**. This issue covers **379** IDs and the hint issue covers **33**, without overlap. Complete membership is in `issues/report-membership.json` under `groups[cause=parser].reportIds`. In this bucket, intake guessed parser for 356 and hint for 23; those guesses are not ground truth.

## Unresolved reports inside this count

The classifier assigns these five desk-noted reports to parser. **They are included in 379, not five additional reports**, and their wording is not adequate proof of this root cause:

| Report | Wording requiring investigation |
| --- | --- |
| R-41202 | Tuesday 12 May versus Monday 11 May. |
| R-41209 | Every booking in June is one day off. |
| R-41236 | Invite arrived before the booking was made. |
| R-41344 | Lisbon Tuesday versus Toronto Monday for the same meeting. |
| R-41620 | Tuesday 6 October showed as Monday. |

Request original input, expected/actual date, tenant/form version, timezone and booking/invite timestamps. Do not infer a timezone/DST defect or declare these resolved by the parser fix without reproduction. Their membership is exported classification, not independent confirmation of causation.

### Broader body-evidence audit

An independent body-only review, cross-checked against a deterministic date-pair audit, found **370** parser-bucket bodies with two complete day/month dates whose components are exchanged and **9** without that complete pattern. The nine include the five original desk flags above and four additional evidence gaps:

| Report | What the body supplies |
| --- | --- |
| R-41290 | A request for a day-first setting, without an observed date pair. |
| R-41417 | Wrong-day impact, without concrete dates. |
| R-41514 | A words/phone-call workaround, without a concrete date pair. |
| R-41615 | October versus January, without day numbers. |

These four are **not new `oneDayMove` flags or newly confirmed defects**. All nine remain included in 379. Absence of a full swap-shaped pair does not establish that the route is wrong; presence of one does not prove its production cause. `issues/report-membership.json` keeps the body-audit membership separate from the unchanged desk-flag list.

## Intended correction and acceptance

- Make the parser respect the tenant's explicit date convention or accept an unambiguous representation.
- Verify both saved booking and generated invite preserve the intended date for ambiguous dates and day values greater than 12; retain correct month-first behavior where supported.
- Exercise app/email traffic and booking-v2 forms, plus app/email for booking-v3 tenants; do not accidentally route the separate hint issue into this fix.
- Give the original desk-flagged reports and broader body-evidence gaps an explicit disposition before treating them as fixed; do not silently promote routing membership to a confirmed diagnosis.
- Record tested revision, paths and release evidence. A queued fix, merge timestamp, or this issue is not proof of deployment or recovery.

## Context

The first reports arrived in April; the first recorded merge into #4471 is 2 July, when 184 reports were merged. The merge spike is not the date the defect began. The original incident's “one issue, one fix queued” account is not established by the report evidence; two classifier buckets do not independently prove two causes either.

Reviewed by Kevon Eaglin with GPT-6.1 Sol, 2026-10-29. See signed review at `src/routes/kb/incidents/4471-review/+page.svx` and its rendered counterpart. This revised local draft has not been applied automatically to public issue #2.
