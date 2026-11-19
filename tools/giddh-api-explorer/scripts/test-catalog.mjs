import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "public/data/catalog.json"), "utf8"));
const errors = [];
const ids = new Set();
const classifications = new Set(["frontend-used", "backend-not-used", "frontend-unmatched"]);

if (!Array.isArray(catalog.records) || catalog.records.length === 0) errors.push("Catalog has no records.");

for (const record of catalog.records) {
    for (const key of ["id", "classification", "method", "path", "service", "description"]) {
        if (record[key] === undefined || record[key] === null || record[key] === "") {
            errors.push(`${record.id || "unknown"}: missing ${key}`);
        }
    }
    if (!classifications.has(record.classification)) errors.push(`${record.id}: invalid classification`);
    if (ids.has(record.id)) errors.push(`${record.id}: duplicate id`);
    ids.add(record.id);
    if (!record.parameters) errors.push(`${record.id}: missing parameters`);
    if (record.classification !== "frontend-unmatched" && !record.curl?.includes("Auth-Key:")) {
        errors.push(`${record.id}: missing Auth-Key curl`);
    }
    if (record.classification !== "frontend-unmatched") {
        if (!record.response || record.response.successExample === undefined) {
            errors.push(`${record.id}: missing response.successExample`);
        }
        if (!Array.isArray(record.response?.errorExamples) || record.response.errorExamples.length === 0) {
            errors.push(`${record.id}: missing response.errorExamples`);
        }
    }
}

const markdownFiles = [];
function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".md")) markdownFiles.push(full);
    }
}
walk(path.join(ROOT, "docs"));

if (markdownFiles.length < 36) errors.push(`Expected at least 36 Markdown files, found ${markdownFiles.length}.`);
if (catalog.counts.records !== catalog.records.length) errors.push("Catalog record count does not match metadata.");
if (!catalog.records.some((record) => record.parameters?.parts?.length)) {
    errors.push("Catalog has no multipart endpoint metadata.");
}

if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
}

console.log(JSON.stringify({
    records: catalog.records.length,
    markdownFiles: markdownFiles.length,
    frontendUsed: catalog.records.filter((record) => record.classification === "frontend-used").length,
    backendNotUsed: catalog.records.filter((record) => record.classification === "backend-not-used").length,
    frontendUnmatched: catalog.records.filter((record) => record.classification === "frontend-unmatched").length,
    deprecated: catalog.records.filter((record) => record.deprecated).length
}, null, 2));
