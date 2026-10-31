<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { hasSwappedDatePair } from '#lib/kb/report-evidence.js';

  const rows = reports as Report[];
  const unique = uniqueById(rows);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const exceptions = merged.filter((r) => notes.oneDayMove.includes(r.id));
  const bodyEvidence = new Map(merged.map((r) => [r.id, hasSwappedDatePair(r.body)]));
  const outsidePair = merged.filter((r) => !bodyEvidence.get(r.id));
  const additionalGaps = outsidePair.filter((r) => !notes.oneDayMove.includes(r.id));
  const evidenceGroups = groups.map((g) => {
    const paired = g.reports.filter((r) => bodyEvidence.get(r.id)).length;
    return { cause: g.cause, paired, other: g.reports.length - paired };
  });
  const firstReceived = Math.min(...merged.map((r) => Date.parse(r.receivedAt)));
  const firstMerged = Math.min(...merged.map((r) => Date.parse(r.mergedAt!)));
  const firstMergeDay = new Date(firstMerged).toISOString().slice(0, 10);
  const waiting = merged.filter((r) => Date.parse(r.receivedAt) < firstMerged).length;
  const firstBatch = merged.filter((r) => r.mergedAt!.slice(0, 10) === firstMergeDay).length;
  const mistagged = merged.filter((r) => r.meta.intakeTag !== causeOf(r, tenantOf(r))).length;
  const hintTenants = [...new Set(groups.find((g) => g.cause === 'hint')!.reports.map((r) => r.tenant))].sort();
  const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);
</script>

<section aria-labelledby="accounting">
  <h2 id="accounting">What the count means</h2>
  <p>The export has {rows.length} rows. Overlapping export pages repeat {rows.length - unique.length} rows;
    one report ID counts once. The routing table counts only unique reports merged into #4471.</p>
  <p>Tenant locale and booking-form version determine the exported classifier's result, not the reporter's
    browser locale, subject line, or intake tag. {mistagged} intake tags disagree with that result.
    The hint reports belong to <code>{hintTenants.join(', ')}</code>; those tenants' app/email reports still
    take the parser path.</p>
</section>

<section aria-labelledby="report-evidence">
  <h2 id="report-evidence">Reported wording and routing are separate evidence</h2>
  <table class="body-matrix">
    <thead><tr><th>classifier bucket</th><th>complete swap-shaped pair</th><th>other or insufficient wording</th></tr></thead>
    <tbody>
      {#each evidenceGroups as g (g.cause)}
        <tr><td><code>{g.cause}</code></td><td>{g.paired}</td><td>{g.other}</td></tr>
      {/each}
    </tbody>
    <tfoot><tr><th>total report IDs</th><td>{merged.length - outsidePair.length}</td><td>{outsidePair.length}</td></tr></tfoot>
  </table>
  <h3>Reports outside the complete swap-pair description</h3>
  <p>{outsidePair.length} report bodies lack that complete pair. The desk's original
    <code>oneDayMove</code> list flags {exceptions.length} of them; {additionalGaps.length} are
    additional body-evidence gaps, not additional desk flags. All remain inside the exported parser count.</p>
  <table class="reports">
    <thead><tr><th>report</th><th>reported behavior</th><th>original desk flag</th></tr></thead>
    <tbody>
      {#each outsidePair as r (r.id)}
        <tr>
          <td><code>{r.id}</code></td>
          <td>{r.body}</td>
          <td>{notes.oneDayMove.includes(r.id) ? 'oneDayMove' : 'not flagged'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<section aria-labelledby="chronology">
  <h2 id="chronology">Received is not the same as merged</h2>
  <p>The first report was received on {day(firstReceived)}. The first recorded merge was on {firstMergeDay},
    with {waiting} reports already received; {firstBatch} reports were merged that day. The initial queue
    spike below is a filing event, not evidence that the product first broke in July.</p>
</section>

<style>
  td { vertical-align: top; }
  td:first-child { white-space: nowrap; }
  .reports td:nth-child(2) { min-width: 15rem; }
  table { display: block; overflow-x: auto; }
</style>
