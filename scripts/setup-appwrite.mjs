import { readFile } from "node:fs/promises";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT?.replace(/\/$/, "");
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.APPWRITE_DATABASE_ID || "bfit-health";
const apiKey = process.env.APPWRITE_SETUP_API_KEY;
if (!endpoint || !projectId || !apiKey) throw new Error("Set NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, and APPWRITE_SETUP_API_KEY before setup.");
const schema = JSON.parse(await readFile(new URL("../src/lib/appwrite/schema.json", import.meta.url), "utf8"));
const headers = { "Content-Type": "application/json", "X-Appwrite-Project": projectId, "X-Appwrite-Key": apiKey };
async function request(route, method = "GET", body) {
  const response = await fetch(endpoint + route, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const text = await response.text(); const data = text ? JSON.parse(text) : null;
  if (!response.ok && response.status !== 409) throw new Error(`Appwrite ${method} ${route} failed (${response.status}): ${data?.message || response.statusText}`);
  return { response, data };
}
async function createOrKeep(route, body) { const { response, data } = await request(route, "POST", body); return response.status === 409 ? null : data; }
async function waitFor(route, label) {
  for (let attempt = 0; attempt < 40; attempt++) { const { data } = await request(route); if (data?.status === "available") return; if (data?.status === "failed") throw new Error(`${label} failed.`); await new Promise((resolve) => setTimeout(resolve, 500)); }
  throw new Error(`Timed out waiting for ${label}.`);
}
const databaseRoute = `/tablesdb/${encodeURIComponent(databaseId)}`;
const databaseCheck = await fetch(endpoint + databaseRoute, { headers });
if (databaseCheck.status === 404) await createOrKeep("/tablesdb", { databaseId, name: "B Fit & Healthy" });
else if (!databaseCheck.ok) throw new Error(`Could not verify Appwrite database ${databaseId} (${databaseCheck.status}).`);
for (const table of schema.tables) {
  const base = `/tablesdb/${encodeURIComponent(databaseId)}/tables`;
  await createOrKeep(base, { tableId: table.id, name: table.id.replaceAll("_", " "), rowSecurity: true, permissions: ['create("users")', ...(table.publicRead ? ['read("any")'] : [])] });
  for (const column of table.fields) {
    const { response } = await request(`${base}/${encodeURIComponent(table.id)}/columns/${column.type}`, "POST", { key: column.key, ...(column.type === "varchar" || column.type === "string" ? { size: column.size || 255, ...(column.array ? { array: true } : {}) } : {}), required: false });
    if (response.status !== 409) await waitFor(`${base}/${encodeURIComponent(table.id)}/columns/${encodeURIComponent(column.key)}`, `${table.id}.${column.key}`);
  }
  for (const index of table.indexes) {
    const { response } = await request(`${base}/${encodeURIComponent(table.id)}/indexes`, "POST", { key: index.key, type: index.type, columns: index.columns });
    if (response.status !== 409) await waitFor(`${base}/${encodeURIComponent(table.id)}/indexes/${encodeURIComponent(index.key)}`, `${table.id}.${index.key}`);
  }
  console.log(`Ready: ${table.id}`);
}
console.log(`Appwrite database ${databaseId} is ready. No user data was imported.`);
