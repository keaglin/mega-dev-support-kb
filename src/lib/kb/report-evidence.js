const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];
const fullDate = /\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)\b/gi;

/**
 * Recognize exactly two English day/month descriptions with exchanged components.
 * This audits report wording; it does not parse booking input or establish a cause.
 * @param {string} body
 * @returns {boolean}
 */
export function hasSwappedDatePair(body) {
  const dates = [...body.matchAll(fullDate)];
  if (dates.length !== 2) return false;
  const [[, firstDay, firstMonth], [, secondDay, secondMonth]] = dates;
  const d1 = Number(firstDay);
  const d2 = Number(secondDay);
  const m1 = months.indexOf(firstMonth.toLowerCase()) + 1;
  const m2 = months.indexOf(secondMonth.toLowerCase()) + 1;
  return d1 === m2 && m1 === d2 && (d1 !== d2 || m1 !== m2);
}
