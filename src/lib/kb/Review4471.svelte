<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const rows = reports as Report[];
  const unique = uniqueById(rows);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const exceptions = merged.filter((r) => notes.oneDayMove.includes(r.id));
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
    one report ID counts once. The cause table counts only unique reports merged into #4471.</p>
  <p>Tenant locale and booking-form version determine the exported classifier's result, not the reporter's
    browser locale, subject line, or intake tag. {mistagged} intake tags disagree with that result.
    The hint reports belong to <code>{hintTenants.join(', ')}</code>; those tenants' app/email reports still
    take the parser path.</p>
</section>

<section aria-labelledby="exceptions">
  <h2 id="exceptions">One-day wording is an unresolved evidence gap</h2>
  <p><code>desk-notes.json</code> flags {exceptions.length} reports as one-day moves. The classifier files all
    of them under parser, and they remain inside its count: they are not additional reports.</p>
  <table>
    <thead><tr><th>report</th><th>tenant / channel</th><th>reported behavior</th><th>filed cause</th></tr></thead>
    <tbody>
      {#each exceptions as r (r.id)}
        <tr>
          <td><code>{r.id}</code></td>
          <td><code>{r.tenant}</code> / {r.channel}</td>
          <td>{r.body}</td>
          <td><code>{causeOf(r, tenantOf(r))}</code></td>
        </tr>
      {/each}
    </tbody>
  </table>
  <p>A month/day swap does not establish why a meeting differs by one day between cities, why a whole month
    is one day off, or why an invite precedes a booking. Request original input, expected and actual dates,
    timezone, form/version, and invite timestamps before confirming these reports share the parser cause.
    The export does not prove a timezone or daylight-saving defect, nor a separate third root cause.</p>
</section>

<section aria-labelledby="chronology">
  <h2 id="chronology">Received is not the same as merged</h2>
  <p>The first report was received on {day(firstReceived)}. The first recorded merge was on {firstMergeDay},
    with {waiting} reports already received; {firstBatch} reports were merged that day. The initial queue
    spike below is a filing event, not evidence that the product first broke in July.</p>
  <p>The source incident says “known” and “one fix queued,” but its review date precedes the latest reports.
    Neither a merge timestamp nor a queued fix proves a fix shipped or that affected clients recovered.</p>
</section>

<style>
  td { vertical-align: top; }
  td:first-child { white-space: nowrap; }
  td:nth-child(3) { min-width: 15rem; }
  table { display: block; overflow-x: auto; }
</style>
