#!/usr/bin/env node
/**
 * Compares published OpenAPI export with frontend-used backend APIs.
 * Writes docs/api/published-gap/{README.md,ACTION-CHECKLIST.md,gap-analysis.json}
 *
 * Usage:
 *   node scripts/generate-published-api-gap-docs.mjs [path/to/Giddh API Reference.json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = path.join(ROOT, "docs/api/coverage/catalog.json");
const OUT_DIR = path.join(ROOT, "docs/api/published-gap");
const PUBLISHED_PATH = process.argv[2]
    || "/Users/divyanshu/Downloads/Giddh API Reference.json";

if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Missing ${CATALOG_PATH}. Generate backend-verified docs first.`);
}
if (!fs.existsSync(PUBLISHED_PATH)) {
    throw new Error(`Missing published OpenAPI: ${PUBLISHED_PATH}`);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const published = JSON.parse(fs.readFileSync(PUBLISHED_PATH, "utf8"));
const frontendUsed = catalog.records.filter((r) => r.classification === "frontend-used");
const allBackend = catalog.records.filter((r) => r.classification !== "frontend-unmatched");

function cleanHtml(value = "") {
    return String(value).replace(/<[^>]+>/g, "").replace(/['"]/g, "").trim();
}

function topFields(node, out = []) {
    if (!node || typeof node !== "object") return out;
    if (node.payload?.value) return topFields(node.payload.value, out);
    for (const [key, value] of Object.entries(node)) {
        if (["value", "type", "description", "default"].includes(key)) continue;
        out.push(key);
    }
    return out;
}

function norm(route = "") {
    return String(route)
        .split("?")[0]
        .replace(/https?:\/\/[^/]+/i, "")
        .replace(/\{\{([^}]+)\}\}/g, "{$1}")
        .replace(/:([A-Za-z_]\w*)/g, "{$1}")
        .replace(/\{([^}:]+)(?::[^}]+)?\}/g, "{}")
        .replace(/\/+/g, "/")
        .replace(/\/$/, "")
        .replace(/^\/+/, "")
        .toLowerCase();
}

function findByPath(method, pathRegex, preferFrontend = true) {
    const pools = preferFrontend ? [frontendUsed, allBackend] : [allBackend, frontendUsed];
    for (const pool of pools) {
        const hits = pool
            .filter((record) => (record.method === method || record.method === "ANY")
                && pathRegex.test(record.path))
            .sort((a, b) => a.path.length - b.path.length);
        if (hits.length) return hits[0];
    }
    return null;
}

/** Explicit published docPath -> real backend route resolver */
const RESOLVERS = {
    "POST /account-apis/create-account": () => findByPath("POST", /\/v2\/company\/\{companyUniqueName\}\/groups\/\{groupUniqueName\}\/accounts\/?$/),
    "GET /account-apis/get-account-balance": () => findByPath("GET", /\/accounts\/\{accountUniqueName[^}]*\}\/balance/),
    "PATCH /account-apis/patch-account-api-v2": () => findByPath("PATCH", /\/v2\/company\/\{companyUniqueName\}\/accounts\/\{accountUniqueName/),
    "PUT /account-apis/update-account-api-v2": () => findByPath("PUT", /\/company\/\{companyUniqueName\}\/accounts\/\{accountUniqueName/)
        || findByPath("PUT", /\/v2\/company\/\{companyUniqueName\}\/accounts\/\{accountUniqueName/),
    "DELETE /account-apis/delete-account-api": () => findByPath("DELETE", /\/company\/\{companyUniqueName\}\/accounts\/\{accountUniqueName/),
    "POST /account-apis/create-group": () => findByPath("POST", /\/company\/\{companyUniqueName\}\/groups\/?$/),
    "DELETE /account-apis/delete-group": () => findByPath("DELETE", /\/company\/\{companyUniqueName\}\/groups\/\{groupUniqueName/),
    "PUT /account-apis/update-group": () => findByPath("PUT", /\/company\/\{companyUniqueName\}\/groups\/\{groupUniqueName/),
    "GET /account-apis/update-group_copy": () => findByPath("GET", /\/groups\/\{groupUniqueName[^}]*\}\/accounts/)
        || findByPath("GET", /\/groups\/flattened-groups-with-accounts/),

    "POST /entry-apis-v2/service/create-entry---with-tax-and-discount": () => findByPath("POST", /\/accounts\/\{accountUniqueName[^}]*\}\/ledgers-?v?\d*\/?$/),
    "PUT /entry-apis-v2/service/update-entry": () => findByPath("PUT", /\/ledgers\/\{/),
    "DELETE /entry-apis-v2/service/delete-entry": () => findByPath("DELETE", /\/ledgers\/\{/),
    "GET /entry-apis-v2/service/get-entry": () => findByPath("GET", /\/ledgers\/\{/),
    "POST /entry-apis-v2/service/advance-receipt-entry-with-gst-and-tds": () => findByPath("POST", /\/accounts\/\{accountUniqueName[^}]*\}\/ledgers/),
    "POST /entry-apis-v2/service/advance-receipt-entry-with-tds": () => findByPath("POST", /\/accounts\/\{accountUniqueName[^}]*\}\/ledgers/),
    "POST /entry-apis-v2/service/advance-receipt-entry-with-gst": () => findByPath("POST", /\/accounts\/\{accountUniqueName[^}]*\}\/ledgers/),
    "POST /entry-apis-v2/stock/create-entry": () => findByPath("POST", /\/accounts\/\{accountUniqueName[^}]*\}\/ledgers/),
    "PUT /entry-apis-v2/stock/update-entry": () => findByPath("PUT", /\/ledgers\/\{/),
    "GET /entry-apis-v2/stock/get-entry": () => findByPath("GET", /\/ledgers\/\{/),
    "DELETE /entry-apis-v2/stock/delete-entry": () => findByPath("DELETE", /\/ledgers\/\{/),
    "DELETE /entry-apis-v2/bulk-delete": () => findByPath("DELETE", /bulk/) || findByPath("POST", /ledgers.*bulk|bulk.*ledger/),
    "POST /entry-apis-v2/attach-file": () => findByPath("POST", /ledger\/upload|\/upload/),

    "POST /voucher-apis-v2/service/create-voucher": () => findByPath("POST", /\/vouchers\/?$/),
    "PUT /voucher-apis-v2/service/update-voucher": () => findByPath("PUT", /\/vouchers/),
    "DELETE /voucher-apis-v2/service/delete-voucher": () => findByPath("DELETE", /\/vouchers/),
    "GET /voucher-apis-v2/service/get-voucher": () => findByPath("GET", /\/vouchers/),
    "POST /voucher-apis-v2/stock/create-voucher": () => findByPath("POST", /\/vouchers\/?$/),
    "PUT /voucher-apis-v2/stock/update-voucher": () => findByPath("PUT", /\/vouchers/),
    "GET /voucher-apis-v2/stock/get-voucher": () => findByPath("GET", /\/vouchers/),
    "DELETE /voucher-apis-v2/stock/delete-voucher": () => findByPath("DELETE", /\/vouchers/),
    "POST /voucher-apis-v2/mail-voucher": () => findByPath("POST", /mail|email/),
    "POST /voucher-apis-v2/cancel-voucher": () => findByPath("POST", /cancel/),
    "POST /voucher-apis-v2/paid-voucher": () => findByPath("POST", /paid|payment/),
    "POST /voucher-apis-v2/get-all-vouchers": () => findByPath("POST", /vouchers.*(get-all|all)|\/vouchers\/get/),
    "POST /voucher-apis-v2/bulk-delete-vouchers": () => findByPath("POST", /bulk.*delete|delete.*bulk|vouchers.*bulk/),
    "POST /voucher-apis-v2/export-voucher": () => findByPath("POST", /export/),
    "POST /voucher-apis-v2/generate-bulk-vouchers": () => findByPath("POST", /bulk/),

    "POST /proforma-apis/generate-proforma": () => findByPath("POST", /proforma/),
    "POST /proforma-apis/get-proforma": () => findByPath("POST", /proforma/),
    "DELETE /proforma-apis/delete-proforma": () => findByPath("DELETE", /proforma/),
    "POST /proforma-apis/mail-proforma": () => findByPath("POST", /proforma/),
    "POST /proforma-apis/get-all-proformas": () => findByPath("POST", /proforma/),
    "PUT /proforma-apis/update-proforma": () => findByPath("PUT", /proforma/),
    "POST /proforma-apis/generate-invoice-from-proforma": () => findByPath("POST", /proforma/),
    "PUT /proforma-apis/update-action-over-proforma": () => findByPath("PUT", /proforma/),
    "POST /proforma-apis/get-all-proforma-version": () => findByPath("POST", /proforma/),
    "POST /proforma-apis/get-all-proforma-versions-v2-api": () => findByPath("POST", /proforma/),

    "POST /estimation-apis/generate-estimate": () => findByPath("POST", /estimate/),
    "POST /estimation-apis/get-estimate": () => findByPath("POST", /estimate/),
    "PUT /estimation-apis/update-estimate": () => findByPath("PUT", /estimate/),
    "DELETE /estimation-apis/delete-estimate": () => findByPath("DELETE", /estimate/),
    "POST /estimation-apis/mail-estimate": () => findByPath("POST", /estimate/),
    "POST /estimation-apis/get-all-estimates": () => findByPath("POST", /estimate/),
    "POST /estimation-apis/generate-invoice-from-estimate": () => findByPath("POST", /estimate/),
    "POST /estimation-apis/get-all-estimate-version": () => findByPath("POST", /estimate/),
    "PUT /estimation-apis/update-action-over-estimate": () => findByPath("PUT", /estimate/),
    "POST /estimation-apis/get-estimate-version": () => findByPath("POST", /estimate/),
    "POST /estimation-apis/generate-proforma-from-estimate": () => findByPath("POST", /estimate|proforma/),
    "POST /estimation-apis/get-all-estimates-version-v2-api": () => findByPath("POST", /estimate/),

    "POST /tax-apis/asssign-tax": () => findByPath("POST", /tax/),
    "POST /tax-apis/create-tax": () => findByPath("POST", /\/company\/\{companyUniqueName\}\/tax\/?$/),
    "GET /tax-apis/get-all-tax": () => findByPath("GET", /\/tax/),
    "POST /tax-apis/create-stock-group-and-assign-tax": () => findByPath("POST", /stock-group/),
    "POST /tax-apis/create-stock-and-assign-tax": () => findByPath("POST", /\/stock/),

    "GET /report-apis/purchases-register-api/purchases-register-overview": () => findByPath("GET", /purchase.*register|purchaseregister/),
    "GET /report-apis/purchases-register-api/purchases-register-detailed": () => findByPath("GET", /purchase.*register|purchaseregister/),
    "GET /report-apis/sales-register-api/sales-register-overview": () => findByPath("GET", /sales.*register|salesregister/),
    "GET /report-apis/sales-register-api/sales-register-detailed": () => findByPath("GET", /sales.*register|salesregister/),
    "GET /report-apis/trial-balance-api": () => findByPath("GET", /trial-balance|trialbalance/),
    "GET /report-apis/balance-sheet-api": () => findByPath("GET", /balance-sheet|balancesheet/),
    "GET /report-apis/export-invoice-api": () => findByPath("GET", /export.*invoice|invoice.*export/),
    "GET /report-apis/customer-vendor-report-api": () => findByPath("GET", /customer|vendor|aging/),
    "POST /report-apis/aging-report-api": () => findByPath("POST", /aging/),
    "POST /report-apis/daybook-report-api": () => findByPath("POST", /daybook|day-book/),

    "POST /inventory-apis-v2/stock-group/create-group": () => findByPath("POST", /stock-group/),
    "PUT /inventory-apis-v2/stock-group/update-group-api": () => findByPath("PUT", /stock-group/),
    "GET /inventory-apis-v2/stock-group/get-group-api": () => findByPath("GET", /stock-group/),
    "DELETE /inventory-apis-v2/stock-group/delete-group-api": () => findByPath("DELETE", /stock-group/),
    "POST /inventory-apis-v2/stocks/create-stock": () => findByPath("POST", /\/stock-group\/\{stockGroupUniqueName\}\/stock\/?$/),
    "PUT /inventory-apis-v2/stocks/update-stock": () => findByPath("PUT", /\/v2\/company\/\{companyUniqueName\}\/stock-group\/\{stockGroupUniqueName\}\/stock\/\{stockUniqueName/),
    "GET /inventory-apis-v2/stocks/get-stock": () => findByPath("GET", /\/stock/),
    "DELETE /inventory-apis-v2/stocks/delete-stock": () => findByPath("DELETE", /\/v2\/company\/\{companyUniqueName\}\/stock-group\/\{stockGroupUniqueName\}\/stock\/\{stockUniqueName/),
    "POST /inventory-apis-v2/stocks/get-all-stocks": () => findByPath("POST", /stocks|stock.*search|get-all.*stock/),
    "POST /inventory-apis-v2/inventory-report/group-wise-report": () => findByPath("POST", /inventory|stock/),
    "POST /inventory-apis-v2/inventory-report/item-wise-report-api": () => findByPath("POST", /inventory|stock/),
    "POST /inventory-apis-v2/inventory-report/variant-report-api": () => findByPath("POST", /variant|inventory/),
    "POST /inventory-apis-v2/inventory-report/transaction-report-api": () => findByPath("POST", /inventory|transaction/),
    "POST /inventory-apis-v2/inventory-report/balance-api-": () => findByPath("POST", /inventory|balance/),

    "GET /dashboard-apis/profit-loss": () => findByPath("GET", /profit-loss|profitloss/),
    "POST /dashboard-apis/voucher-count-api-": () => findByPath("POST", /count|dashboard/),
    "POST /dashboard-apis/voucher-balance-api": () => findByPath("POST", /balance|dashboard/),

    "POST /petty-cash-manager-api-s/create-petty-cash-entry": () => findByPath("POST", /expense|petty/),
    "POST /petty-cash-manager-api-s/petty-cash-entry-action-api": () => findByPath("POST", /expense|petty/),
    "GET /petty-cash-manager-api-s/get-pettycash-entry-api": () => findByPath("GET", /expense|petty/),
    "POST /petty-cash-manager-api-s/get-all-petty-cash-entry-grid-view-for-admin": () => findByPath("POST", /expense|petty/),
    "GET /petty-cash-manager-api-s/client-get-all-petty-cash-entries": () => findByPath("GET", /expense|petty/),

    "GET /vat-apis/view-vat-report": () => findByPath("GET", /vat/),
    "GET /vat-apis/download-vat-report": () => findByPath("GET", /vat/),

    "POST /account-balances-report-apis/monthly-columnar-report-for-api": () => findByPath("POST", /columnar|closing-balance/),
    "POST /account-balances-report-apis/monthly-columnar-report-for-api_copy": () => findByPath("POST", /columnar|closing-balance|export/),
    "POST /export-apis/ledger-export---excel": () => findByPath("POST", /ledger/) || findByPath("POST", /export/),
    "GET /export-apis/view-export-requests": () => findByPath("GET", /export/),
    "GET /export-apis/bill-to-bill-export-api": () => findByPath("GET", /bill-to-bill|billtobill|export/),
    "POST /permission-apis/assign-role": () => findByPath("POST", /permission|role/),
    "POST /audit-trail/activity-log": () => findByPath("POST", /audit|activity/),

    "POST /purchase-order/service/create-purchase-order": () => findByPath("POST", /purchase-order|purchaseorder/),
    "PUT /purchase-order/service/update-purchase-order": () => findByPath("PUT", /purchase-order|purchaseorder/),
    "POST /purchase-order/stock/create-purchase-order": () => findByPath("POST", /purchase-order|purchaseorder/),
    "PUT /purchase-order/stock/update-purchase-order": () => findByPath("PUT", /purchase-order|purchaseorder/),
    "POST /purchase-order/get-all-purchase-orders": () => findByPath("POST", /purchase-order|purchaseorder/),
    "GET /purchase-order/get-purchase-order": () => findByPath("GET", /purchase-order|purchaseorder/),
    "DELETE /purchase-order/delete-purchase-order": () => findByPath("DELETE", /purchase-order|purchaseorder/),
    "PATCH /purchase-order/bulk-purchase-orders": () => findByPath("PATCH", /purchase-order|purchaseorder/),
    "PATCH /purchase-order/convert-to-purchase-bill": () => findByPath("PATCH", /purchase-order|purchaseorder|purchase-bill|purchase-record/),
    "PATCH /purchase-order/cancel-purchase-order": () => findByPath("PATCH", /purchase-order|purchaseorder/),

    "GET /branch-apis/get-all-branches": () => findByPath("GET", /branch/),
    "GET /customer-api/untitled": () => findByPath("GET", /accounts/) || findByPath("POST", /accounts/),
    "POST /customer-api/get-all-customers_copy": () => findByPath("POST", /\/v2\/company\/\{companyUniqueName\}\/groups\/\{groupUniqueName\}\/accounts\/?$/),
    "GET /customer-api/create-customer_copy": () => findByPath("GET", /groups/)
};

function extractPublishedOps() {
    const ops = [];
    for (const [docPath, methods] of Object.entries(published.paths || {})) {
        for (const [method, op] of Object.entries(methods || {})) {
            if (!op || typeof op !== "object") continue;
            const params = (op.parameters || []).map((parameter) => ({
                name: cleanHtml(parameter.name),
                in: parameter.in,
                required: Boolean(parameter.required)
            }));
            const junkParams = params.filter((parameter) => !parameter.name
                || /^\d+$/.test(parameter.name)
                || ["t", "z", "lang", "content-type", "Content-Type"].includes(parameter.name));
            const meaningfulParams = params.filter((parameter) => parameter.name
                && !junkParams.includes(parameter)
                && !["Auth-Key", "auth-key"].includes(parameter.name));
            ops.push({
                docPath,
                method: method.toUpperCase(),
                summary: op.summary || docPath,
                description: String(op.description || ""),
                params,
                junkParams,
                meaningfulParams,
                bodyFields: op.requestBody?.description && typeof op.requestBody.description === "object"
                    ? topFields(op.requestBody.description)
                    : [],
                hasResponses: Boolean(op.responses && Object.keys(op.responses).length)
            });
        }
    }
    return ops;
}

function domainOf(record) {
    const blob = `${record.path} ${record.controller} ${record.handler} ${record.description}`.toLowerCase();
    if (/auth|login|signup|session|otp|twofactor|forgot|verify-email|register/.test(blob)) return "01-auth-login";
    if (/branchcontroller|companycontroller|warehouse|financialyear|\/branches|\/warehouses|\/financial-year/.test(blob)) return "02-company-branches";
    if ((/account|group/.test(blob)) && !/stock/.test(blob)) return "03-accounts-groups";
    if (/ledger|daybook/.test(blob)) return "04-ledger-daybook";
    if (/voucher|invoice|proforma|estimate|sales|receipt|payment|credit-note|debit-note/.test(blob)) return "05-vouchers-sales";
    if (/purchase/.test(blob)) return "06-purchase";
    if (/stock|inventory|manufactur|recipe|variant|stock-unit/.test(blob)) return "07-inventory-manufacturing";
    if (/\bgst\b|\bvat\b|eway|hsn|sac|\btax\b/.test(blob)) return "08-gst-vat";
    if (/report|dashboard|profit|balancesheet|trial|aging|columnar|cashflow/.test(blob)) return "09-reports-dashboard";
    if (/setting|permission|role|user|template|\btag\b|invoice-setting/.test(blob)) return "10-settings";
    if (/subscription|plan|billing|paymentmethod|razor|stripe|license/.test(blob)) return "11-subscriptions";
    if (/import|export|ocr|tally|bank-statement|sync|excel/.test(blob)) return "12-imports-sync-ocr";
    return "13-misc";
}

function summarizeMatch(match) {
    if (!match) return null;
    return {
        id: match.id,
        method: match.method,
        path: match.path,
        controller: match.controller,
        handler: match.handler,
        service: match.service,
        classification: match.classification,
        deprecated: Boolean(match.deprecated),
        requestBodyType: match.requestBody?.type || null,
        backendFields: (match.requestBody?.fields || []).map((field) => field.name),
        pathParams: (match.parameters?.path || []).map((parameter) => parameter.name),
        queryParams: (match.parameters?.query || []).map((parameter) => parameter.name),
        frontendUsage: (match.frontendUsage || []).map((usage) => usage.id).slice(0, 8),
        curl: match.curl || null
    };
}

const pubs = extractPublishedOps();
const results = pubs.map((pub) => {
    const key = `${pub.method} ${pub.docPath}`;
    const match = RESOLVERS[key] ? RESOLVERS[key]() : null;
    const issues = [];
    if (pub.junkParams.length) {
        issues.push(`Remove junk params (${[...new Set(pub.junkParams.map((parameter) => parameter.name || "empty"))].join(", ")})`);
    }
    if (!pub.meaningfulParams.length) {
        issues.push("Add real path/query params to OpenAPI (currently missing or only in markdown)");
    }
    if (!match) issues.push("Could not resolve real backend route — manual mapping required");
    if (match) {
        const backendFields = (match.requestBody?.fields || []).map((field) => field.name);
        const publishedSet = new Set(pub.bodyFields.map((field) => field.toLowerCase()));
        const backendSet = new Set(backendFields.map((field) => field.toLowerCase()));
        const missingInPublished = backendFields.filter((field) => !publishedSet.has(field.toLowerCase()));
        const extraInPublished = pub.bodyFields.filter((field) => backendSet.size && !backendSet.has(field.toLowerCase()));
        if (missingInPublished.length) {
            issues.push(`Add/update payload fields from backend: ${missingInPublished.slice(0, 15).join(", ")}${missingInPublished.length > 15 ? ` (+${missingInPublished.length - 15})` : ""}`);
        }
        if (extraInPublished.length) {
            issues.push(`Review published-only fields: ${extraInPublished.slice(0, 15).join(", ")}${extraInPublished.length > 15 ? ` (+${extraInPublished.length - 15})` : ""}`);
        }
        issues.push(`Set published path to real route: \`${match.path}\``);
        if (match.deprecated) issues.push("Backend marks route deprecated");
        if (match.classification === "backend-not-used") issues.push("Matched route is not used by current frontend");
    }
    if (!pub.hasResponses) issues.push("Add response examples");
    return {
        ...pub,
        match: summarizeMatch(match),
        issues,
        needsUpdate: true
    };
});

const coveredIds = new Set(results.filter((result) => result.match).map((result) => result.match.id));
const coveredKeys = new Set(results.filter((result) => result.match).map((result) => `${result.match.method}|${norm(result.match.path)}`));
const missing = frontendUsed.filter((record) => !coveredIds.has(record.id) && !coveredKeys.has(`${record.method}|${norm(record.path)}`));
const missingByDomain = {};
for (const record of missing) {
    const domain = domainOf(record);
    (missingByDomain[domain] || (missingByDomain[domain] = [])).push(record);
}

const needUpdate = results.filter((result) => result.needsUpdate);
const unresolved = results.filter((result) => !result.match);
const esc = (value) => String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");

fs.mkdirSync(OUT_DIR, { recursive: true });

const md = [];
md.push("# Published Giddh API Docs — Update & Missing List");
md.push("");
md.push("Compares exported public OpenAPI (`Giddh API Reference.json`, **119** operations) with **frontend-used** APIs that exist in backend controllers.");
md.push("");
md.push("Use this folder to update existing published docs and upload missing ones.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| Metric | Count |");
md.push("| --- | ---: |");
md.push(`| Published operations | ${results.length} |`);
md.push(`| Published needing update | ${needUpdate.length} |`);
md.push(`| Published unresolved to backend route | ${unresolved.length} |`);
md.push(`| Frontend-used + backend-matched | ${frontendUsed.length} |`);
md.push(`| Missing from published | ${missing.length} |`);
md.push("");
md.push("## How to use");
md.push("");
md.push("1. **Section A** — fix already published pages.");
md.push("2. **Section B** — create new pages for missing frontend+backend APIs.");
md.push("3. **ACTION-CHECKLIST.md** — checkbox tracker.");
md.push("4. **gap-analysis.json** — machine-readable params/payloads for upload.");
md.push("");
md.push("Regenerate:");
md.push("");
md.push("```bash");
md.push("node scripts/generate-published-api-gap-docs.mjs \"/path/to/Giddh API Reference.json\"");
md.push("```");
md.push("");
md.push("## Common update rules");
md.push("");
md.push("- Replace alias path (`/account-apis/...`) with real route.");
md.push("- Remove junk params: `t`, `z`, `lang`, `0`, `1`, duplicate `content-type`, HTML spans.");
md.push("- Model real path/query params (`companyUniqueName`, `branchUniqueName`, ...).");
md.push("- Auth header: `Auth-Key`.");
md.push("- Align body + response with backend controller and frontend usage.");
md.push("");
md.push("## A. Published APIs that need modify / update");
md.push("");
needUpdate.forEach((result, index) => {
    md.push(`### A${index + 1}. ${result.method} \`${result.docPath}\``);
    md.push("");
    md.push(`- **Published title:** ${result.summary}`);
    if (result.match) {
        md.push(`- **Real API:** \`${result.match.method} ${result.match.path}\``);
        md.push(`- **Backend:** ${result.match.service} · \`${result.match.controller}#${result.match.handler}\``);
        md.push(`- **Frontend ids:** ${(result.match.frontendUsage || []).join(", ") || "n/a"}`);
        if (result.match.pathParams.length) md.push(`- **Path params:** ${result.match.pathParams.join(", ")}`);
        if (result.match.queryParams.length) md.push(`- **Query params:** ${result.match.queryParams.join(", ")}`);
        if (result.match.requestBodyType) md.push(`- **Body type:** \`${result.match.requestBodyType}\``);
    } else {
        md.push("- **Real API:** unresolved");
    }
    md.push("- **Updates needed:**");
    result.issues.forEach((issue) => md.push(`  - ${issue}`));
    if (result.match?.backendFields?.length) md.push(`- **Backend fields:** ${result.match.backendFields.join(", ")}`);
    if (result.bodyFields.length) md.push(`- **Published fields:** ${result.bodyFields.join(", ")}`);
    md.push("");
});

md.push("## B. Missing from published (frontend used + backend exists)");
md.push("");
md.push(`Total missing: **${missing.length}**`);
md.push("");
for (const domain of Object.keys(missingByDomain).sort()) {
    const list = missingByDomain[domain].sort((a, b) => (`${a.path}${a.method}`).localeCompare(`${b.path}${b.method}`));
    md.push(`### ${domain} (${list.length})`);
    md.push("");
    md.push("| Method | Real path | Controller | Frontend ids | Title |");
    md.push("| --- | --- | --- | --- | --- |");
    for (const record of list) {
        const frontendIds = (record.frontendUsage || []).map((usage) => usage.id).slice(0, 3).join("<br>") || "—";
        md.push(`| ${record.method} | \`${esc(record.path)}\` | ${esc(record.controller)}#${esc(record.handler)} | ${esc(frontendIds)} | ${esc(record.description || record.handler)} |`);
    }
    md.push("");
}

md.push("## C. New upload template");
md.push("");
md.push("```md");
md.push("### {Title}");
md.push("- Method / URL: {METHOD} https://apitest.giddh.com{path}");
md.push("- Headers: Auth-Key");
md.push("- Path / Query / Body: copy from gap-analysis.json");
md.push("- Response fields used by UI: from frontend evidence");
md.push("- Controller: {Controller}#{handler}");
md.push("```");
md.push("");

fs.writeFileSync(path.join(OUT_DIR, "README.md"), md.join("\n"));

const checklist = [
    "# Published API Docs — Action Checklist",
    "",
    `Update **${needUpdate.length}** published · Add **${missing.length}** missing`,
    "",
    "## A. Update existing published",
    ""
];
needUpdate.forEach((result, index) => {
    checklist.push(`${index + 1}. [ ] \`${result.method}\` ${result.docPath} → ${result.match ? `\`${result.match.method} ${result.match.path}\`` : "**UNRESOLVED**"}`);
    result.issues.slice(0, 5).forEach((issue) => checklist.push(`   - ${issue}`));
});
checklist.push("", "## B. Add missing", "");
for (const domain of Object.keys(missingByDomain).sort()) {
    checklist.push(`### ${domain}`);
    for (const record of missingByDomain[domain]) {
        checklist.push(`- [ ] \`${record.method}\` \`${record.path}\` (${record.controller}#${record.handler})`);
    }
    checklist.push("");
}
fs.writeFileSync(path.join(OUT_DIR, "ACTION-CHECKLIST.md"), checklist.join("\n"));

fs.writeFileSync(path.join(OUT_DIR, "gap-analysis.json"), JSON.stringify({
    generatedAt: new Date().toISOString(),
    publishedSource: PUBLISHED_PATH,
    counts: {
        published: results.length,
        publishedNeedUpdate: needUpdate.length,
        publishedUnresolved: unresolved.length,
        frontendUsed: frontendUsed.length,
        missingFromPublished: missing.length,
        missingByDomain: Object.fromEntries(Object.entries(missingByDomain).map(([key, value]) => [key, value.length]))
    },
    publishedNeedUpdate: needUpdate.map((result) => ({
        method: result.method,
        docPath: result.docPath,
        summary: result.summary,
        issues: result.issues,
        match: result.match,
        publishedBodyFields: result.bodyFields
    })),
    missingFromPublished: missing.map((record) => ({
        id: record.id,
        method: record.method,
        path: record.path,
        service: record.service,
        controller: record.controller,
        handler: record.handler,
        description: record.description,
        domain: domainOf(record),
        frontendUsage: (record.frontendUsage || []).map((usage) => usage.id),
        parameters: record.parameters,
        requestBody: record.requestBody,
        curl: record.curl
    }))
}, null, 2));

console.log(JSON.stringify({
    outDir: OUT_DIR,
    published: results.length,
    matched: results.filter((result) => result.match).length,
    unresolved: unresolved.length,
    missing: missing.length,
    missingByDomain: Object.fromEntries(Object.entries(missingByDomain).map(([key, value]) => [key, value.length])),
    unresolvedDocs: unresolved.map((result) => `${result.method} ${result.docPath}`),
    sample: results.slice(0, 5).map((result) => ({
        doc: result.docPath,
        real: result.match && `${result.match.method} ${result.match.path}`
    }))
}, null, 2));
