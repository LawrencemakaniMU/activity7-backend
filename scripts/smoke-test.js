// Runs the Activity 7 checklist against a running API.
// Usage: npm run smoke -- http://localhost:3000      or      npm run smoke -- https://your-backend.onrender.com
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const good = { title: "Smoke test request", category: "Network", description: "Created by the smoke test.", status: "Pending" };
let failed = 0;

async function call(method, path, body, raw) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (raw !== undefined) options.body = raw;
  else if (body !== undefined) options.body = JSON.stringify(body);
  const res = await fetch(base + path, options);
  let data = null;
  try { data = await res.json(); } catch { /* not JSON */ }
  return { status: res.status, data };
}

function check(name, condition, detail) {
  if (!condition) failed++;
  console.log((condition ? "PASS  " : "FAIL  ") + name + (condition ? "" : "  -> " + JSON.stringify(detail)));
}

(async () => {
  let r = await call("GET", "/health");
  check("GET /health returns 200", r.status === 200, r);

  r = await call("GET", "/api/records");
  check("GET /api/records returns 200 and an array", r.status === 200 && Array.isArray(r.data), r);

  r = await call("POST", "/api/records", good);
  check("POST valid body returns 201 with id", r.status === 201 && Number.isInteger(r.data?.id), r);
  const id = r.data?.id;

  r = await call("POST", "/api/records", { ...good, id: 9999 });
  check("POST ignores a client-supplied id", r.status === 201 && r.data.id !== 9999, r);
  const extraId = r.data?.id;

  r = await call("GET", "/api/records/" + id);
  check("GET one returns the created record", r.status === 200 && r.data.title === good.title, r);

  r = await call("PUT", "/api/records/" + id, { ...good, title: "Updated title", status: "Completed" });
  check("PUT returns 200, new values, same id", r.status === 200 && r.data.id === id && r.data.status === "Completed", r);

  r = await call("POST", "/api/records", { ...good, title: "  " });
  check("POST spaces-only title returns 400 with message", r.status === 400 && !!r.data?.message, r);

  r = await call("POST", "/api/records", { ...good, status: "Done" });
  check("POST invalid status returns 400", r.status === 400, r);

  r = await call("POST", "/api/records", { ...good, title: 123 });
  check("POST non-string title returns 400", r.status === 400, r);

  r = await call("POST", "/api/records", undefined, "{bad json");
  check("POST malformed JSON returns 400 JSON", r.status === 400 && !!r.data?.message, r);

  r = await call("GET", "/api/records/abc");
  check("GET invalid id returns 400", r.status === 400, r);

  r = await call("GET", "/api/records/999999");
  check("GET missing id returns 404", r.status === 404, r);
  r = await call("PUT", "/api/records/999999", good);
  check("PUT missing id returns 404", r.status === 404, r);
  r = await call("DELETE", "/api/records/999999");
  check("DELETE missing id returns 404", r.status === 404, r);

  r = await call("GET", "/nothing-here");
  check("Unknown route returns 404 JSON", r.status === 404 && !!r.data?.message, r);

  r = await call("DELETE", "/api/records/" + id);
  check("DELETE returns 200 and message", r.status === 200 && r.data?.message === "Record deleted.", r);
  r = await call("GET", "/api/records/" + id);
  check("GET deleted id now returns 404", r.status === 404, r);

  if (extraId) await call("DELETE", "/api/records/" + extraId); // tidy up
  console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
  process.exitCode = failed === 0 ? 0 : 1;
})().catch(error => { console.error("Could not reach the API:", error.message); process.exitCode = 1; });
