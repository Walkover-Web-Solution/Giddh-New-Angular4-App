import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPOSITORY_ROOT = path.resolve(PROJECT_ROOT, "../..");
const SOURCE_DOCS = path.join(REPOSITORY_ROOT, "docs/api");
const TARGET_DOCS = path.join(PROJECT_ROOT, "docs");
const DATA_DIR = path.join(PROJECT_ROOT, "public/data");
const SOURCE_CATALOG = path.join(SOURCE_DOCS, "coverage/catalog.json");
const TARGET_CATALOG = path.join(DATA_DIR, "catalog.json");

if (!fs.existsSync(SOURCE_CATALOG)) {
    throw new Error(
        `Missing ${SOURCE_CATALOG}. Run "node scripts/generate-backend-verified-api-docs.mjs" from the frontend repository first.`
    );
}

fs.rmSync(TARGET_DOCS, { recursive: true, force: true });
fs.mkdirSync(TARGET_DOCS, { recursive: true });
fs.cpSync(SOURCE_DOCS, TARGET_DOCS, {
    recursive: true,
    filter: (source) => {
        const relative = path.relative(SOURCE_DOCS, source).split(path.sep);
        if (relative[0] === "published-gap") return false;
        if (relative[0] === "coverage" && /\.(json)$/i.test(relative.at(-1) || "")) return false;
        return true;
    }
});
fs.mkdirSync(DATA_DIR, { recursive: true });

const catalog = JSON.parse(fs.readFileSync(SOURCE_CATALOG, "utf8"));
catalog.records = catalog.records.map((record) => {
    const response = record.response;
    if (!response) return record;
    const errorExamples = Array.isArray(response.errorExamples)
        ? response.errorExamples.slice(0, 12).map((item) => ({
            httpStatus: item.httpStatus,
            httpStatusName: item.httpStatusName,
            code: item.code,
            message: item.message,
            exception: item.exception,
            when: item.when,
            example: item.example
        }))
        : response.errorExamples;
    return {
        ...record,
        response: {
            envelope: response.envelope,
            declaredType: response.declaredType,
            bodyEvidence: response.bodyEvidence,
            status: response.status,
            httpStatus: response.httpStatus,
            successExample: response.successExample,
            errorExamples,
            liveCapture: response.liveCapture
        }
    };
});
fs.writeFileSync(TARGET_CATALOG, JSON.stringify(catalog));

console.log(`Synced ${catalog.records.length} API records and Markdown docs to ${PROJECT_ROOT}`);
