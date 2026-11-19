import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, "public");
const DOCS_DIR = path.join(ROOT, "docs");
const PORT = Number(process.env.PORT || 4310);
// Always bind all interfaces. Do not use process.env.HOST — platforms often set it to a hostname, which breaks listen().
const HOST = "0.0.0.0";
const MAX_REQUEST_BYTES = 25 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 60_000;
const FORBIDDEN_HEADERS = new Set([
    "host",
    "content-length",
    "connection",
    "transfer-encoding",
    "upgrade",
    "proxy-authorization",
    "proxy-authenticate",
    "cookie",
    "set-cookie"
]);

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon"
};

function json(response, status, data) {
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(data));
}

async function readJson(request) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        size += chunk.length;
        if (size > MAX_REQUEST_BYTES) throw new Error("Request is larger than 25 MB.");
        chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : {};
}

function isAllowedTarget(target) {
    if (!["http:", "https:"].includes(target.protocol)) return false;
    const hostname = target.hostname.toLowerCase();
    if (["localhost", "127.0.0.1", "::1"].includes(hostname)) return true;
    if (hostname === "giddh.com" || hostname.endsWith(".giddh.com")) return true;
    const extraHosts = (process.env.GIDDH_API_EXPLORER_ALLOWED_HOSTS || "")
        .split(",")
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean);
    return extraHosts.includes(hostname);
}

function sanitizedHeaders(input) {
    const headers = new Headers();
    for (const [name, value] of Object.entries(input || {})) {
        if (!value || FORBIDDEN_HEADERS.has(name.toLowerCase())) continue;
        headers.set(name, String(value));
    }
    return headers;
}

function multipartBody(parts, headers) {
    const form = new FormData();
    for (const part of parts) {
        if (!part?.name) throw new Error("Each multipart field requires a name.");
        if (part.base64 !== undefined) {
            const bytes = Buffer.from(String(part.base64), "base64");
            form.append(
                String(part.name),
                new Blob([bytes], { type: part.contentType || "application/octet-stream" }),
                part.filename || "upload"
            );
        } else {
            form.append(String(part.name), String(part.value ?? ""));
        }
    }
    headers.delete("content-type");
    return form;
}

async function proxyRequest(request, response) {
    try {
        const payload = await readJson(request);
        const target = new URL(payload.url);
        if (!isAllowedTarget(target)) {
            return json(response, 400, {
                error: "Target is not allowed. Use localhost, 127.0.0.1, or a *.giddh.com host."
            });
        }

        const method = String(payload.method || "GET").toUpperCase();
        if (!["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].includes(method)) {
            return json(response, 400, { error: `Unsupported HTTP method: ${method}` });
        }

        const headers = sanitizedHeaders(payload.headers);
        const body = ["GET", "HEAD"].includes(method)
            ? undefined
            : Array.isArray(payload.multipart)
                ? multipartBody(payload.multipart, headers)
                : payload.body === undefined || payload.body === null
                    ? undefined
                    : typeof payload.body === "string" ? payload.body : JSON.stringify(payload.body);
        const startedAt = performance.now();
        const upstream = await fetch(target, {
            method,
            headers,
            body,
            redirect: "manual",
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });

        const bytes = Buffer.from(await upstream.arrayBuffer());
        if (bytes.length > MAX_RESPONSE_BYTES) {
            return json(response, 413, { error: "Upstream response is larger than 10 MB." });
        }

        const contentType = upstream.headers.get("content-type") || "application/octet-stream";
        const isText = /^text\//i.test(contentType)
            || /json|xml|javascript|x-www-form-urlencoded/i.test(contentType);
        const responseHeaders = {};
        for (const name of ["content-type", "content-disposition", "location", "x-request-id"]) {
            const value = upstream.headers.get(name);
            if (value) responseHeaders[name] = value;
        }

        return json(response, 200, {
            status: upstream.status,
            statusText: upstream.statusText,
            durationMs: Math.round(performance.now() - startedAt),
            headers: responseHeaders,
            contentType,
            encoding: isText ? "text" : "base64",
            body: isText ? bytes.toString("utf8") : bytes.toString("base64")
        });
    } catch (error) {
        const message = error?.name === "TimeoutError"
            ? "Request timed out after 60 seconds."
            : error instanceof SyntaxError
                ? "Invalid JSON sent to the local proxy."
                : error?.message || "Request failed.";
        return json(response, 502, { error: message });
    }
}

function safeFile(root, requestPath) {
    const decoded = decodeURIComponent(requestPath);
    const resolved = path.resolve(root, `.${decoded}`);
    return resolved === root || resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

function serveFile(response, filePath) {
    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
    response.writeHead(200, {
        "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cache-Control": filePath.endsWith(".json") ? "no-store" : "public, max-age=60"
    });
    fs.createReadStream(filePath).pipe(response);
    return true;
}

const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || `${HOST}:${PORT}`}`);

    if (requestUrl.pathname === "/api/proxy") {
        if (request.method !== "POST") return json(response, 405, { error: "POST required." });
        return proxyRequest(request, response);
    }

    if (requestUrl.pathname === "/api/health") {
        return json(response, 200, { status: "ok" });
    }

    if (requestUrl.pathname.startsWith("/docs/")) {
        const docsPath = safeFile(DOCS_DIR, requestUrl.pathname.slice("/docs".length));
        if (serveFile(response, docsPath)) return;
    }

    const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
    const publicPath = safeFile(PUBLIC_DIR, pathname);
    if (serveFile(response, publicPath)) return;

    json(response, 404, { error: "Not found." });
});

server.listen(PORT, HOST, () => {
    console.log(`Giddh API Explorer: http://${HOST}:${PORT}`);
    console.log("Proxy targets: localhost and *.giddh.com");
});
