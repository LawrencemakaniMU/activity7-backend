const STATUSES = ["Pending", "In progress", "Completed"];
const MAX_ID = 2147483647; // largest value of a Postgres integer id

// Returns a positive whole number, or null when the text is not one.
function parseId(value) {
  if (!/^[1-9]\d*$/.test(String(value))) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
}

const RULES = [
  { key: "title", label: "Title", min: 3, max: 80 },
  { key: "category", label: "Category", min: 2, max: 40 },
  { key: "description", label: "Description", min: 5, max: 300 }
];

// Returns { values } with trimmed text, or { error } with a clear message.
function validateRecord(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a JSON object." };
  }
  const values = {};
  for (const { key, label, min, max } of RULES) {
    const raw = body[key];
    if (raw === undefined || raw === null) return { error: `${label} is required.` };
    if (typeof raw !== "string") return { error: `${label} must be text.` };
    const text = raw.trim();
    if (text.length < min || text.length > max) {
      return { error: `${label} must have ${min} to ${max} characters.` };
    }
    values[key] = text;
  }
  if (body.status === undefined || body.status === null) return { error: "Status is required." };
  if (typeof body.status !== "string") return { error: "Status must be text." };
  const status = body.status.trim();
  if (!STATUSES.includes(status)) {
    return { error: "Status must be Pending, In progress or Completed." };
  }
  values.status = status;
  return { values };
}

module.exports = { parseId, validateRecord, STATUSES, MAX_ID };
