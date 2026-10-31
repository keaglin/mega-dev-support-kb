import test from 'node:test';
import assert from 'node:assert/strict';
import { hasSwappedDatePair } from './report-evidence.js';

test('recognizes exchanged day/month components in a reported outcome', () => {
  assert.equal(hasSwappedDatePair('Booked for 2 December. The invite says 12 February.'), true);
});

test('does not mistake an adjacent-day discrepancy for a component exchange', () => {
  assert.equal(hasSwappedDatePair('Invite says Tuesday 12 May. Calendar says Monday 11 May.'), false);
});

test('does not call an unchanged symmetric date a reported swap', () => {
  assert.equal(hasSwappedDatePair('Booked for 5 May. The invite says 5 May.'), false);
});

test('does not cherry-pick a swapped pair from a report containing another complete date', () => {
  assert.equal(hasSwappedDatePair('Booked for 2 December, changed to 3 December, invite says 12 February.'), false);
});
