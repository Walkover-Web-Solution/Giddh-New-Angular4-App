#!/usr/bin/env node

/**
 * Generates controller-backed API documentation for the four Giddh services and
 * compares it with the frontend API inventory in docs/api/NN-*.md.
 *
 * No backend repository is modified.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sanitizeJavaDocText } from "./sanitize-javadoc.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = path.join(ROOT, "docs/api");
const BACKEND_DOCS = path.join(DOCS, "backend");
const USED_DOCS = path.join(DOCS, "frontend-used");
const COVERAGE_DOCS = path.join(DOCS, "coverage");

const API_BASE = "https://apitest.giddh.com";
const COMPANY = "dcrcdiin17887749442630bsy43";
const BRANCH = "aaaa";
const AUTH_KEY = "dNYPuoiWrFz********go=";

const SERVICES = [
    {
        id: "giddh-api-v2",
        title: "Giddh API v2",
        root: "/Users/divyanshu/Downloads/giddha-giddh-api-v2-57797b57402f",
        doc: "giddh-api-v2.md"
    },
    {
        id: "accounting-microservice",
        title: "Accounting Microservice",
        root: "/Users/divyanshu/Downloads/giddha-giddh-accounting-microservice-21ec5e126986",
        doc: "accounting-microservice.md"
    },
    {
        id: "import-microservice",
        title: "Import Microservice",
        root: "/Users/divyanshu/Downloads/giddha-giddh-import-microservice-eb3f6ae25db5",
        doc: "import-microservice.md"
    },
    {
        id: "search-api",
        title: "Search API",
        root: "/Users/divyanshu/Downloads/giddha-giddh-search-api-a9ab0faf66ed",
        doc: "search-api.md"
    }
];

const VERB_BY_ANNOTATION = {
    GetMapping: ["GET"],
    PostMapping: ["POST"],
    PutMapping: ["PUT"],
    PatchMapping: ["PATCH"],
    DeleteMapping: ["DELETE"]
};
const ALL_VERBS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const JAVA_PRIMITIVES = new Set([
    "String", "boolean", "Boolean", "int", "Integer", "long", "Long", "double", "Double",
    "float", "Float", "BigDecimal", "LocalDate", "LocalDateTime", "Date", "Instant", "Object",
    "JsonNode", "MultipartFile", "HttpServletRequest", "HttpServletResponse", "User", "Company", "Branch"
]);
const PLACEHOLDERS = {
    companyUniqueName: COMPANY,
    companyname: COMPANY,
    company: COMPANY,
    branchUniqueName: BRANCH,
    accountUniqueName: "SAMPLE_ACCOUNT",
    voucherUniqueName: "SAMPLE_VOUCHER",
    entryUniqueName: "SAMPLE_ENTRY",
    ledgerUniqueName: "SAMPLE_LEDGER",
    groupUniqueName: "SAMPLE_GROUP",
    stockGroupUniqueName: "SAMPLE_STOCK_GROUP",
    stockUniqueName: "SAMPLE_STOCK",
    uniqueName: "SAMPLE_UNIQUE_NAME",
    id: "SAMPLE_ID",
    page: "1",
    count: "20",
    size: "20",
    from: "01-04-2025",
    to: "31-03-2026",
    q: "",
    sort: "desc",
    sortBy: "date"
};

function walk(dir, predicate, result = []) {
    if (!fs.existsSync(dir)) return result;
    for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) {
            if (!["target", "build", ".git", "node_modules"].includes(item.name)) walk(full, predicate, result);
        } else if (predicate(full)) {
            result.push(full);
        }
    }
    return result;
}

function lineOf(source, index) {
    return source.slice(0, index).split("\n").length;
}

function stripJavaComments(source) {
    return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function balanced(source, openIndex, open = "(", close = ")") {
    if (source[openIndex] !== open) return null;
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let i = openIndex; i < source.length; i++) {
        const char = source[i];
        if (quote) {
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === quote) quote = null;
            continue;
        }
        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
            continue;
        }
        if (char === open) depth++;
        if (char === close && --depth === 0) return { content: source.slice(openIndex + 1, i), end: i + 1 };
    }
    return null;
}

function splitTopLevel(source, delimiter = ",") {
    const result = [];
    let current = "";
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (const char of source) {
        if (quote) {
            current += char;
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === quote) quote = null;
            continue;
        }
        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
            current += char;
        } else if ("({[<".includes(char)) {
            depth++;
            current += char;
        } else if (")}]>".includes(char)) {
            depth--;
            current += char;
        } else if (char === delimiter && depth === 0) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    if (current.trim()) result.push(current.trim());
    return result;
}

function javaStringConstants(source) {
    const constants = new Map();
    const clean = stripJavaComments(source);
    const literal = /\b(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:final\s+)?String\s+(\w+)\s*=\s*"([^"]*)"\s*;/g;
    for (const match of clean.matchAll(literal)) constants.set(match[1], match[2]);
    let changed = true;
    while (changed) {
        changed = false;
        const concat = /\b(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:final\s+)?String\s+(\w+)\s*=\s*([^;]+);/g;
        for (const match of clean.matchAll(concat)) {
            if (constants.has(match[1])) continue;
            const value = resolveJavaExpression(match[2], constants);
            if (value !== null) {
                constants.set(match[1], value);
                changed = true;
            }
        }
    }
    return constants;
}

function resolveJavaExpression(expression, constants) {
    const parts = splitTopLevel(expression, "+");
    let output = "";
    for (const raw of parts) {
        const token = raw.trim();
        if (/^"[\s\S]*"$/.test(token)) output += token.slice(1, -1);
        else if (constants.has(token)) output += constants.get(token);
        else if (constants.has(token.split(".").at(-1))) output += constants.get(token.split(".").at(-1));
        else return null;
    }
    return output;
}

function annotationAt(source, atIndex) {
    const match = source.slice(atIndex).match(/^@(\w+)/);
    if (!match) return null;
    const name = match[1];
    let end = atIndex + match[0].length;
    while (/\s/.test(source[end])) end++;
    let args = "";
    if (source[end] === "(") {
        const parsed = balanced(source, end);
        if (!parsed) return null;
        args = parsed.content;
        end = parsed.end;
    }
    return { name, args, start: atIndex, end };
}

function mappingAnnotations(source) {
    const result = [];
    const regex = /@(RequestMapping|GetMapping|PostMapping|PutMapping|PatchMapping|DeleteMapping)\b/g;
    for (const match of source.matchAll(regex)) {
        const annotation = annotationAt(source, match.index);
        if (annotation) result.push(annotation);
    }
    return result;
}

function annotationValue(args, key) {
    const keyMatch = new RegExp(`(?:^|,)\\s*${key}\\s*=\\s*`).exec(args);
    if (!keyMatch) return null;
    const start = keyMatch.index + keyMatch[0].length;
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let i = start; i < args.length; i++) {
        const char = args[i];
        if (quote) {
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === quote) quote = null;
            continue;
        }
        if (char === "\"") quote = char;
        else if ("({[".includes(char)) depth++;
        else if (")}]".includes(char)) depth--;
        else if (char === "," && depth === 0) return args.slice(start, i).trim();
    }
    return args.slice(start).trim();
}

function quotedStrings(expression) {
    if (!expression) return [];
    return [...expression.matchAll(/"((?:\\.|[^"])*)"/g)].map((match) => match[1].replace(/\\"/g, "\""));
}

function mappingPaths(annotation, constants) {
    if (!annotation.args.trim()) return [""];
    const explicit = annotationValue(annotation.args, "value") ?? annotationValue(annotation.args, "path");
    const expression = explicit ?? (!annotation.args.includes("=") ? annotation.args : null);
    if (!expression) return [""];
    const strings = quotedStrings(expression);
    if (strings.length) return strings;
    const resolved = resolveJavaExpression(expression.replace(/[{}]/g, ""), constants);
    return resolved === null ? [`<unresolved:${expression.replace(/\s+/g, " ")}>`] : [resolved];
}

function mappingMethods(annotation) {
    if (VERB_BY_ANNOTATION[annotation.name]) return VERB_BY_ANNOTATION[annotation.name];
    const methodExpression = annotationValue(annotation.args, "method");
    if (!methodExpression) return ["ANY"];
    const methods = [...methodExpression.matchAll(/\b(GET|POST|PUT|PATCH|DELETE)\b/g)].map((match) => match[1]);
    return methods.length ? [...new Set(methods)] : ["ANY"];
}

function stripTrailingSlash(route) {
    if (!route || route === "/") return route;
    const [pathPart, ...queryParts] = String(route).split("?");
    const cleaned = pathPart === "/" ? pathPart : pathPart.replace(/\/+$/, "");
    return queryParts.length ? `${cleaned}?${queryParts.join("?")}` : cleaned;
}

function joinPaths(prefix, suffix) {
    if (prefix.startsWith("<unresolved:") || suffix.startsWith("<unresolved:")) return `${prefix}${suffix}`;
    const joined = `${prefix || ""}/${suffix || ""}`.replace(/\/+/g, "/");
    const withLeading = joined.startsWith("/") ? joined : `/${joined}`;
    return stripTrailingSlash(withLeading);
}

function methodAfter(source, index) {
    const window = source.slice(index, index + 12000);
    const match = /\b(public|protected)\s+(?:static\s+)?(?:final\s+)?([\w<>, ?.\[\]]+)\s+(\w+)\s*\(/.exec(window);
    if (!match) return null;
    const open = index + match.index + match[0].lastIndexOf("(");
    const params = balanced(source, open);
    if (!params) return null;
    const afterParams = source.slice(params.end, params.end + 800);
    const throwsMatch = /^\s*(?:throws\s+([\w\s,.]+))?\s*\{/.exec(afterParams);
    const throwsClause = throwsMatch?.[1]
        ? throwsMatch[1].split(",").map((item) => item.trim()).filter(Boolean)
        : [];
    return {
        name: match[3],
        returnType: match[2].trim(),
        params: params.content,
        throws: throwsClause,
        signatureStart: index + match.index,
        bodyStart: source.indexOf("{", params.end),
        paramsEnd: params.end
    };
}

function parseParameterAnnotations(parameter) {
    const annotations = {};
    const regex = /@(\w+)\s*(?:\(([\s\S]*?)\))?/g;
    for (const match of parameter.matchAll(regex)) annotations[match[1]] = match[2] ?? "";
    return annotations;
}

function annotationOption(args, key) {
    const value = annotationValue(args, key);
    if (!value) return null;
    const strings = quotedStrings(value);
    return strings[0] ?? value.replace(/\bStringUtils\.(?:EMPTY|SPACE)\b/g, "").trim();
}

function boundParameterName(args, javaName) {
    const named = annotationOption(args, "value") || annotationOption(args, "name");
    if (named) return named;
    if (args && !args.includes("=")) return quotedStrings(args)[0] || javaName;
    return javaName;
}

function cleanParameterType(parameter) {
    return parameter
        .replace(/@\w+(?:\((?:[^()]|\([^()]*\))*\))?\s*/g, "")
        .replace(/\bfinal\s+/g, "")
        .trim()
        .match(/^([\w.<>, ?\[\]]+)\s+\w+$/)?.[1]?.trim() ?? "unknown";
}

function parameterName(parameter) {
    return parameter.replace(/@\w+(?:\((?:[^()]|\([^()]*\))*\))?\s*/g, "").trim().match(/(\w+)\s*$/)?.[1] ?? "unknown";
}

function parseParameters(paramsSource, enumIndex) {
    const result = { path: [], query: [], headers: [], parts: [], body: null };
    for (const parameter of splitTopLevel(paramsSource)) {
        const annotations = parseParameterAnnotations(parameter);
        const type = cleanParameterType(parameter);
        const javaName = parameterName(parameter);
        const enumValues = enumIndex.get(baseType(type)) ?? [];
        if (annotations.PathVariable !== undefined) {
            result.path.push({
                name: boundParameterName(annotations.PathVariable, javaName),
                type,
                required: annotationOption(annotations.PathVariable, "required") !== "false"
            });
        } else if (annotations.RequestParam !== undefined) {
            const args = annotations.RequestParam;
            const name = boundParameterName(args, javaName);
            const defaultValue = annotationOption(args, "defaultValue");
            const requiredOption = annotationOption(args, "required");
            const item = {
                name, type, required: requiredOption === null ? defaultValue === null : requiredOption === "true",
                defaultValue, allowedValues: enumValues
            };
            if (type.includes("MultipartFile")) result.parts.push(item);
            else result.query.push(item);
        } else if (annotations.RequestHeader !== undefined) {
            const args = annotations.RequestHeader;
            result.headers.push({
                name: boundParameterName(args, javaName),
                type,
                required: annotationOption(args, "required") !== "false",
                defaultValue: annotationOption(args, "defaultValue"),
                allowedValues: enumValues
            });
        } else if (annotations.RequestBody !== undefined) {
            result.body = { type, required: annotationOption(annotations.RequestBody, "required") !== "false" };
        } else if (annotations.RequestPart !== undefined) {
            result.parts.push({
                name: boundParameterName(annotations.RequestPart, javaName),
                type,
                required: annotationOption(annotations.RequestPart, "required") !== "false",
                allowedValues: enumValues
            });
        }
    }
    return result;
}

function baseType(type) {
    return type.replace(/\[\]$/, "").replace(/.*<\s*/, "").replace(/\s*>.*$/, "").replace(/\?.*/, "").trim();
}

function buildJavaTypeIndex(service) {
    const javaRoot = path.join(service.root, "src/main/java");
    const files = walk(javaRoot, (file) => file.endsWith(".java"));
    const enums = new Map();
    const models = new Map();

    for (const file of files) {
        const source = fs.readFileSync(file, "utf8");
        const enumMatch = /\benum\s+(\w+)[^{]*\{/.exec(source);
        if (enumMatch) {
            const body = balanced(source, source.indexOf("{", enumMatch.index), "{", "}")?.content ?? "";
            const constantsPart = body.split(";")[0];
            const values = splitTopLevel(constantsPart)
                .map((value) => value.trim().match(/^([A-Z][A-Z0-9_]*)\b/)?.[1])
                .filter(Boolean);
            enums.set(enumMatch[1], values);
        }
    }

    for (const file of files) {
        const source = fs.readFileSync(file, "utf8");
        const classMatch = /\b(?:class|record)\s+(\w+)/.exec(source);
        if (!classMatch) continue;
        const className = classMatch[1];
        const fields = [];
        const fieldRegex = /((?:\s*@[\w.]+(?:\([^;\n]*\))?\s*)*)\s*(?:private|protected|public)\s+(?!static\b)(?:final\s+)?([\w.<>, ?\[\]]+)\s+(\w+)\s*(?:=[^;]*)?;/g;
        for (const match of source.matchAll(fieldRegex)) {
            const annotations = match[1] || "";
            if (/@(?:JsonIgnore|Transient)\b/.test(annotations)) continue;
            const type = match[2].trim();
            const allowedValues = enums.get(baseType(type)) ?? [];
            const constraints = [...annotations.matchAll(/@(NotNull|NotBlank|NotEmpty|Email|Size|Min|Max|Pattern)\b(?:\(([^)]*)\))?/g)]
                .map((item) => item[2] ? `${item[1]}(${item[2].replace(/\s+/g, " ")})` : item[1]);
            fields.push({
                name: annotationOption(annotations, "value") || match[3],
                javaName: match[3],
                type,
                required: constraints.some((constraint) => /NotNull|NotBlank|NotEmpty/.test(constraint)),
                constraints,
                allowedValues
            });
        }
        if (fields.length) models.set(className, { className, fields, file: path.relative(service.root, file) });
    }
    return { enums, models };
}

function buildGlobalStringConstants(service) {
    const constants = new Map();
    const files = walk(path.join(service.root, "src/main/java"), (file) => file.endsWith(".java"));
    for (const file of files) {
        const source = fs.readFileSync(file, "utf8");
        for (const [name, value] of javaStringConstants(source)) {
            if (!constants.has(name)) constants.set(name, value);
        }
    }
    return constants;
}

const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    GONE: 410,
    PRECONDITION_FAILED: 412,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    I_AM_A_TEAPOT: 418
};

const EXCEPTION_HTTP_STATUS = {
    AlreadyExistException: "CONFLICT",
    InvalidTaxException: "CONFLICT",
    InvalidOperationException: "CONFLICT",
    InvalidRequestException: "NOT_ACCEPTABLE",
    CustomExceptionWithErrorDetails: "NOT_ACCEPTABLE",
    HttpMediaTypeNotAcceptableException: "NOT_ACCEPTABLE",
    NotPermittedException: "PRECONDITION_FAILED",
    DuplicateEntityException: "PRECONDITION_FAILED",
    NotFoundException: "NOT_FOUND",
    InvalidParameterException: "BAD_REQUEST",
    InValidHeaderException: "BAD_REQUEST",
    GstReconcileException: "BAD_REQUEST",
    MethodArgumentNotValidException: "BAD_REQUEST",
    UnAuthorizeException: "UNAUTHORIZED",
    InvalidAuthKeyException: "UNAUTHORIZED",
    InvalidSessionIdException: "UNAUTHORIZED",
    EncryptionException: "UNAUTHORIZED",
    GoogleVerificationException: "UNAUTHORIZED",
    LinkedInVerificationException: "UNAUTHORIZED",
    TwitterVerificationException: "UNAUTHORIZED",
    AppleVerificationException: "UNAUTHORIZED",
    InvalidAdminSessionException: "UNAUTHORIZED",
    UserVerificationException: "UNAUTHORIZED",
    UnexpectedException: "UNPROCESSABLE_ENTITY",
    InvalidDataAccessApiUsageException: "GONE",
    TransactionException: "GONE",
    InvalidCloudflareIpException: "I_AM_A_TEAPOT"
};

const EXCEPTION_DEFAULT_CODE = {
    NotFoundException: "NOT_FOUND",
    InvalidParameterException: "INVALID_PARAMETERS",
    InvalidRequestException: "INVALID_REQUEST",
    UnAuthorizeException: "UNAUTHORIZED",
    InvalidAuthKeyException: "INVALID_AUTH_KEY",
    InvalidSessionIdException: "INVALID_SESSION",
    NotPermittedException: "NOT_PERMITTED",
    AlreadyExistException: "ALREADY_EXIST",
    DuplicateEntityException: "DUPLICATE_ENTITY",
    MethodArgumentNotValidException: "INVALID_PARAMETERS"
};

function exceptionSimpleName(name) {
    return String(name || "").replace(/^.*\./, "").trim();
}

function parseThrownExceptions(methodSource, throwsClause = []) {
    const found = new Map();
    for (const name of throwsClause) {
        const simple = exceptionSimpleName(name);
        if (!simple || simple === "Exception") continue;
        if (!found.has(simple)) {
            found.set(simple, {
                exception: simple,
                message: humanize(simple.replace(/Exception$/, "")) || simple,
                code: EXCEPTION_DEFAULT_CODE[simple] || simple.replace(/Exception$/, "").replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase()
            });
        }
    }
    const throwRegex = /throw\s+new\s+([\w.]+)\s*\(([\s\S]*?)\)\s*;/g;
    for (const match of methodSource.matchAll(throwRegex)) {
        const simple = exceptionSimpleName(match[1]);
        if (!simple) continue;
        const args = splitTopLevel(match[2]).map((item) => item.trim()).filter(Boolean);
        const strings = args.flatMap((arg) => quotedStrings(arg));
        const message = strings[0] || found.get(simple)?.message || humanize(simple.replace(/Exception$/, "")) || simple;
        const code = strings[1] || EXCEPTION_DEFAULT_CODE[simple] || found.get(simple)?.code || "ERROR";
        found.set(simple, { exception: simple, message, code });
    }
    return [...found.values()];
}

function responseBodyExample(returnType, methodSource, typeIndex) {
    const successArg = /new\s+ApiResponseSuccess\s*\(([\s\S]*?)\)\s*(?:,|\))/.exec(methodSource)?.[1]?.replace(/\s+/g, " ").trim();
    if (successArg) {
        const stringLiteral = quotedStrings(successArg)[0];
        if (stringLiteral !== undefined && !successArg.includes("new ")) return stringLiteral;
        const constructed = /new\s+([\w.]+)\s*\(/.exec(successArg)?.[1];
        if (constructed) {
            const model = typeIndex?.models?.get(exceptionSimpleName(constructed));
            if (model) {
                const object = {};
                for (const field of model.fields) object[field.name] = exampleValue(field.type, field.allowedValues, 1);
                return object;
            }
            return { type: exceptionSimpleName(constructed) };
        }
        if (/^[A-Za-z_][\w.]*$/.test(successArg)) return { reference: successArg };
    }

    const entityType = returnType.match(/ResponseEntity\s*<\s*([^>]+)\s*>/)?.[1]?.trim()
        || returnType.replace(/\s+/g, " ").trim();
    const inner = entityType.replace(/^ApiResponse(?:Success|Error)?\s*<\s*/, "").replace(/\s*>$/, "");
    const model = typeIndex?.models?.get(baseType(inner));
    if (model) {
        const object = {};
        for (const field of model.fields) object[field.name] = exampleValue(field.type, field.allowedValues, 1);
        return object;
    }
    if (/byte\s*\[\]|Resource|InputStream/.test(returnType)) return "[binary]";
    if (/String\b/.test(inner)) return "string";
    if (/List|Set|Collection|Page/.test(inner)) return [];
    return {};
}

function buildErrorExample(item) {
    const httpStatusName = EXCEPTION_HTTP_STATUS[item.exception] || "BAD_REQUEST";
    return {
        httpStatus: HTTP_STATUS_CODE[httpStatusName] ?? 400,
        httpStatusName,
        code: item.code,
        message: item.message,
        exception: item.exception,
        when: `${item.exception} raised by controller or shared ExceptionHandler`,
        example: {
            status: "error",
            code: item.code,
            message: item.message
        }
    };
}

function inferResponse(methodSource, returnType, options = {}) {
    const { throwsClause = [], typeIndex = null, routePath = "" } = options;
    const statusName = methodSource.match(/(?:HttpStatus\.)?(OK|CREATED|ACCEPTED|NO_CONTENT|BAD_REQUEST|NOT_FOUND|INTERNAL_SERVER_ERROR)\b/)?.[1] ?? "OK";
    const successArg = /new\s+ApiResponseSuccess\s*\(([\s\S]*?)\)\s*(?:,|\))/.exec(methodSource)?.[1]?.replace(/\s+/g, " ").trim();
    const raw = !/ApiResponse/.test(returnType);
    const body = responseBodyExample(returnType, methodSource, typeIndex);
    const successExample = raw
        ? (typeof body === "string" || Array.isArray(body) ? body : body)
        : { status: "success", body };

    const thrown = parseThrownExceptions(methodSource, throwsClause);
    if (/companyUniqueName|Auth-Key|company\//i.test(routePath) || /\{companyUniqueName\}/.test(routePath)) {
        for (const common of [
            { exception: "InvalidAuthKeyException", message: "Invalid Auth-Key.", code: "INVALID_AUTH_KEY" },
            { exception: "InvalidSessionIdException", message: "Invalid Session-Id.", code: "INVALID_SESSION" },
            { exception: "NotFoundException", message: "Company not found.", code: "NOT_FOUND" }
        ]) {
            if (!thrown.some((item) => item.exception === common.exception)) thrown.push(common);
        }
    }
    if (!thrown.length) {
        thrown.push(
            { exception: "InvalidParameterException", message: "Invalid request parameters.", code: "INVALID_PARAMETERS" },
            { exception: "UnexpectedException", message: "Unexpected error.", code: "UNEXPECTED_ERROR" }
        );
    }

    const errorExamples = thrown.map(buildErrorExample)
        .sort((a, b) => a.httpStatus - b.httpStatus || a.code.localeCompare(b.code));
    const possibleErrors = errorExamples.map((item) => ({
        httpStatus: item.httpStatus,
        code: item.code,
        exception: item.exception,
        when: item.when
    }));

    return {
        envelope: raw ? "raw" : "ApiResponse",
        declaredType: returnType,
        bodyEvidence: successArg ? truncate(successArg, 180) : raw ? returnType : "Object (not statically resolved)",
        status: statusName,
        httpStatus: HTTP_STATUS_CODE[statusName] ?? 200,
        successExample,
        errorExamples,
        possibleErrors
    };
}

function enrichResponseWithFrontendFields(response, frontendResponseEvidence) {
    if (!response || !frontendResponseEvidence || response.envelope === "raw") return response;
    const fields = String(frontendResponseEvidence)
        .split(/[\n,]/)
        .map((item) => item.replace(/^[-*`\s]+/, "").trim())
        .filter((item) => item && !/^(status|message|body|code)$/i.test(item) && /^[A-Za-z_][\w.]*$/.test(item));
    if (!fields.length) return response;
    const body = response.successExample && typeof response.successExample === "object" && !Array.isArray(response.successExample)
        ? { ...(response.successExample.body && typeof response.successExample.body === "object" && !Array.isArray(response.successExample.body)
            ? response.successExample.body
            : {}) }
        : {};
    for (const field of fields.slice(0, 40)) {
        if (!(field in body)) body[field] = "string";
    }
    return {
        ...response,
        successExample: {
            status: "success",
            body
        },
        frontendResponseFields: fields
    };
}

function formatResponseSection(response) {
    const successJson = JSON.stringify(response.successExample ?? { status: "success", body: {} }, null, 2);
    const errorRows = (response.possibleErrors || []).map((item) =>
        `| ${item.httpStatus} | \`${item.code}\` | \`${item.exception}\` | ${item.when.replace(/\|/g, "/")} |`).join("\n");
    const firstError = response.errorExamples?.[0]?.example
        ?? { status: "error", code: "ERROR", message: "Request failed." };
    return `#### Success response

- HTTP status: \`${response.httpStatus ?? 200} ${response.status || "OK"}\`
- Envelope: \`${response.envelope}\`
- Declared return: \`${response.declaredType}\`
- Body evidence: \`${String(response.bodyEvidence || "").replace(/`/g, "'")}\`

\`\`\`json
${successJson}
\`\`\`

#### Possible error responses

| HTTP | code | exception | when |
| --- | --- | --- | --- |
${errorRows || "| 400 | \`INVALID_PARAMETERS\` | \`InvalidParameterException\` | invalid request |"}

Example error:

\`\`\`json
${JSON.stringify(firstError, null, 2)}
\`\`\``;
}

function endpointDescription(source, annotationStart, methodName) {
    const before = source.slice(Math.max(0, annotationStart - 1500), annotationStart);
    const doc = /\/\*\*([\s\S]*?)\*\/\s*(?:@Deprecated(?:\([^)]*\))?\s*)?$/.exec(before)?.[1];
    if (!doc) return humanize(methodName);
    const line = doc.split("\n")
        .map((item) => item.replace(/^\s*\*\s?/, "").trim())
        .filter((item) => item && !item.startsWith("@") && !/^This (method|api)/i.test(item))[0];
    const raw = line || humanize(methodName);
    return sanitizeJavaDocText(raw);
}

function humanize(value) {
    return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, (char) => char.toUpperCase());
}

function truncate(value, length) {
    return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function extractServiceEndpoints(service) {
    const typeIndex = buildJavaTypeIndex(service);
    const globalConstants = buildGlobalStringConstants(service);
    const controllerRoot = path.join(service.root, "src/main/java");
    const files = walk(controllerRoot, (file) => file.endsWith(".java"));
    const endpoints = [];
    const controllers = new Set();

    for (const file of files) {
        const source = fs.readFileSync(file, "utf8");
        if (!/@(?:Rest)?Controller\b/.test(source)) continue;
        const classMatch = /\bclass\s+(\w+)/.exec(source);
        if (!classMatch) continue;
        const className = classMatch[1];
        controllers.add(className);
        const constants = new Map([...globalConstants, ...javaStringConstants(source)]);
        const annotations = mappingAnnotations(source);
        const classMapping = annotations.filter((item) => item.start < classMatch.index).at(-1);
        const prefixes = classMapping ? mappingPaths(classMapping, constants) : [""];

        for (const annotation of annotations) {
            if (annotation.start < classMatch.index) continue;
            const method = methodAfter(source, annotation.end);
            if (!method) continue;
            const between = source.slice(annotation.end, method.signatureStart);
            if (/@(?:RequestMapping|GetMapping|PostMapping|PutMapping|PatchMapping|DeleteMapping)\b/.test(between)) continue;
            const paths = mappingPaths(annotation, constants);
            const verbs = mappingMethods(annotation);
            const parameters = parseParameters(method.params, typeIndex.enums);
            const methodBody = method.bodyStart >= 0
                ? balanced(source, method.bodyStart, "{", "}")?.content ?? ""
                : "";
            const deprecatedContext = source.slice(Math.max(classMatch.index, annotation.start - 1000), annotation.start);
            const deprecated = /@Deprecated\b|@deprecated\b/i.test(deprecatedContext);
            const consumes = annotationValue(annotation.args, "consumes") || annotationValue(annotation.args, "headers");
            const produces = annotationValue(annotation.args, "produces");
            const requestModel = parameters.body ? modelFor(parameters.body.type, typeIndex) : null;

            for (const prefix of prefixes) {
                for (const route of paths) {
                    const fullPath = joinPaths(prefix, route);
                    const response = inferResponse(methodBody, method.returnType, {
                        throwsClause: method.throws,
                        typeIndex,
                        routePath: fullPath
                    });
                    for (const verb of verbs) {
                        endpoints.push({
                            service: service.id,
                            serviceTitle: service.title,
                            controller: className,
                            handler: method.name,
                            method: verb,
                            path: fullPath,
                            description: endpointDescription(source, annotation.start, method.name),
                            parameters,
                            response,
                            requestModel,
                            consumes: consumes?.replace(/\s+/g, " ") ?? null,
                            produces: produces?.replace(/\s+/g, " ") ?? null,
                            deprecated,
                            sourceFile: path.relative(service.root, file),
                            sourceLine: lineOf(source, annotation.start)
                        });
                    }
                }
            }
        }
    }
    return {
        endpoints,
        controllers: controllers.size,
        handlers: new Set(endpoints.map((endpoint) => `${endpoint.controller}#${endpoint.handler}`)).size,
        typeIndex
    };
}

function modelFor(type, typeIndex) {
    const raw = baseType(type);
    if (typeIndex.models.has(raw)) return typeIndex.models.get(raw);
    if (/^(?:List|Set|Collection|LinkedList)<String>$/.test(type)) {
        return { className: type, fields: [{ name: "items", type: "string[]", required: true, constraints: [], allowedValues: [] }] };
    }
    return null;
}

function normalizeRoute(route) {
    return route
        .split("?")[0]
        .replace(/^https?:\/\/[^/]+/i, "")
        .replace(/\{\{[^}]+}}/g, "{}")
        .replace(/:[A-Za-z_]\w*/g, "{}")
        .replace(/\{[^}]+}/g, "{}")
        .replace(/\/+/g, "/")
        .replace(/^\/|\/$/g, "")
        .toLowerCase();
}

function parseFrontendDocs() {
    const usage = collectFrontendUsage();
    const files = fs.readdirSync(DOCS).filter((file) => /^\d{2}-.*\.md$/.test(file)).sort();
    const endpoints = [];
    for (const file of files) {
        const source = `${fs.readFileSync(path.join(DOCS, file), "utf8")}\n---\n`;
        const regex = /^### `([^`]+)`\n([\s\S]*?)(?=^---$|^### `|\Z)/gm;
        for (const match of source.matchAll(regex)) {
            const body = match[2];
            const method = /\*\*Method:\*\* `([^`]+)`/.exec(body)?.[1];
            const route = /\*\*Path template:\*\* `([^`]+)`/.exec(body)?.[1];
            if (!method || !route) continue;
            const id = match[1].replace(/ \(PUT update\)$/, "");
            const actualUsage = usage.get(id);
            const methods = actualUsage?.methods.size ? [...actualUsage.methods] : [method];
            for (const actualMethod of methods) {
                endpoints.push({
                    id: match[1],
                    method: actualMethod,
                    path: route.startsWith("/") ? route : `/${route}`,
                    domainFile: file,
                    sourceEvidence: actualUsage?.evidence.length
                        ? actualUsage.evidence.join("; ")
                        : /\*\*Source:\*\* `([^`]+)`(?: · service: `([^`]+)`)?/.exec(body)?.slice(1).filter(Boolean).join(" · ") ?? "frontend generated inventory",
                    methodEvidence: actualUsage?.methods.size ? "actual frontend HTTP call" : "frontend declaration inference",
                    previousPayload: /\*\*Expected payload\*\*\s*```([\s\S]*?)```/.exec(body)?.[1]?.trim() ?? "",
                    previousResponse: /\*\*Response fields used\*\*([\s\S]*?)\*\*curl\*\*/.exec(body)?.[1]?.trim() ?? ""
                });
            }
        }
    }
    const seen = new Set();
    return endpoints.filter((endpoint) => {
        const baseId = endpoint.id.replace(/ \(PUT update\)$/, "");
        const key = `${baseId}:${endpoint.method}:${endpoint.path}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function collectFrontendUsage() {
    const usage = new Map();
    const appRoot = path.join(ROOT, "apps/web-giddh/src/app");
    const files = walk(appRoot, (file) => file.endsWith(".service.ts"));
    for (const file of files) {
        const source = fs.readFileSync(file, "utf8");
        const methodRegex = /(?:public|private|protected)\s+(?:readonly\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/g;
        for (const declaration of source.matchAll(methodRegex)) {
            const open = source.indexOf("{", declaration.index + declaration[0].length - 1);
            const parsed = balanced(source, open, "{", "}");
            if (!parsed) continue;
            const body = parsed.content;
            const httpMethods = new Set(
                [...body.matchAll(/this\.http\.(get|post|put|patch|delete)\s*\(/gi)].map((item) => item[1].toUpperCase())
            );
            if (!httpMethods.size) continue;
            const refs = new Set(
                [...body.matchAll(/\b([A-Z][A-Z0-9_]*(?:\.[A-Za-z_$][\w$]*)+)/g)]
                    .map((item) => item[1].replace(/\.(replace|pipe|map|toString|trim|concat)$/, ""))
                    .filter((ref) => ref.includes("_API.") || /^[A-Z][A-Z0-9_]+\./.test(ref))
            );
            for (const ref of refs) {
                if (!usage.has(ref)) usage.set(ref, { methods: new Set(), evidence: [] });
                const entry = usage.get(ref);
                for (const httpMethod of httpMethods) entry.methods.add(httpMethod);
                entry.evidence.push(`${path.relative(ROOT, file)}#${declaration[1]}`);
            }
        }
    }
    return usage;
}

/** Path-segment placeholders in frontend apiurls that map to multiple backend routes. */
const DYNAMIC_PATH_SEGMENT_VALUES = {
    ":voucherType": ["delivery-challan", "receipt-note"]
};

function expandFrontendPathVariants(path) {
    let variants = [path];
    for (const [token, values] of Object.entries(DYNAMIC_PATH_SEGMENT_VALUES)) {
        const segmentPattern = new RegExp(`(?<=/)${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=/|$)`, "g");
        const next = [];
        for (const candidate of variants) {
            if (!segmentPattern.test(candidate)) {
                next.push(candidate);
                continue;
            }
            segmentPattern.lastIndex = 0;
            for (const value of values) {
                next.push(candidate.replace(segmentPattern, value));
            }
        }
        variants = next;
    }
    return variants;
}

function frontendMatchKeys(endpoint) {
    return expandFrontendPathVariants(endpoint.path).map(
        (path) => `${endpoint.method} ${normalizeRoute(path)}`
    );
}

function matchFrontend(frontend, backend) {
    const backendByKey = new Map();
    for (const endpoint of backend) {
        const verbs = endpoint.method === "ANY" ? ALL_VERBS : [endpoint.method];
        for (const verb of verbs) {
            const key = `${verb} ${normalizeRoute(endpoint.path)}`;
            if (!backendByKey.has(key)) backendByKey.set(key, []);
            backendByKey.get(key).push(endpoint);
        }
    }
    const matched = [];
    const unmatched = [];
    const matchedBackend = new Set();
    for (const endpoint of frontend) {
        const seenCandidates = new Set();
        const candidates = [];
        for (const key of frontendMatchKeys(endpoint)) {
            for (const candidate of backendByKey.get(key) ?? []) {
                const identity = backendIdentity(candidate);
                if (seenCandidates.has(identity)) continue;
                seenCandidates.add(identity);
                candidates.push(candidate);
            }
        }
        if (candidates.length) {
            matched.push({ frontend: endpoint, backend: candidates });
            for (const candidate of candidates) matchedBackend.add(backendIdentity(candidate));
        } else {
            const samePath = backend.filter((candidate) => normalizeRoute(candidate.path) === normalizeRoute(endpoint.path));
            const sameLastSegment = backend.filter((candidate) => routeSimilarity(candidate.path, endpoint.path) >= 0.7).slice(0, 5);
            unmatched.push({ frontend: endpoint, samePath, near: sameLastSegment });
        }
    }
    const backendNotUsed = backend.filter((endpoint) => !matchedBackend.has(backendIdentity(endpoint)));
    return { matched, unmatched, backendNotUsed };
}

function backendIdentity(endpoint) {
    return `${endpoint.service}:${endpoint.method}:${endpoint.path}:${endpoint.controller}:${endpoint.handler}`;
}

function routeSimilarity(a, b) {
    const aa = normalizeRoute(a).split("/");
    const bb = normalizeRoute(b).split("/");
    const max = Math.max(aa.length, bb.length);
    let same = 0;
    for (let i = 0; i < Math.min(aa.length, bb.length); i++) {
        if (aa[i] === bb[i] || aa[i] === "{}" || bb[i] === "{}") same++;
    }
    return max ? same / max : 0;
}

function resolveExamplePath(route) {
    const resolved = route
        .replace(/\{\{([^}]+)}}/g, (_, name) => placeholder(name))
        .replace(/\{([^}:]+)(?::[^}]+)?}/g, (_, name) => placeholder(name))
        .replace(/:([A-Za-z_]\w*)/g, (_, name) => placeholder(name))
        .replace(/\/+/g, "/");
    return resolved === "/" ? resolved : resolved.replace(/\/+$/, "");
}

function placeholder(name) {
    return encodeURIComponent(PLACEHOLDERS[name] ?? (name.toLowerCase().includes("company") ? COMPANY : `SAMPLE_${name}`));
}

function queryFor(endpoint) {
    const params = new URLSearchParams();
    for (const item of endpoint.parameters.query) {
        const value = item.defaultValue !== null && item.defaultValue !== undefined && !item.defaultValue.includes("ValueConstants")
            ? item.defaultValue.replace(/^"|"$/g, "")
            : item.allowedValues?.[0] ?? PLACEHOLDERS[item.name] ?? `SAMPLE_${item.name}`;
        params.set(item.name, value);
    }
    if (endpoint.path.includes("{companyUniqueName}") && !params.has("branchUniqueName")) params.set("branchUniqueName", BRANCH);
    const query = params.toString();
    return query ? `?${query}` : "";
}

function exampleValue(type, allowedValues = [], depth = 0) {
    if (/List|Set|Collection|\[\]/.test(type)) return allowedValues.length ? [allowedValues[0]] : [];
    if (allowedValues.length) return allowedValues[0];
    if (/boolean|Boolean/.test(type)) return false;
    if (/int|Integer|long|Long|double|Double|float|Float|BigDecimal/.test(type)) return 0;
    if (/Map|JsonNode|Object/.test(type)) return {};
    if (/LocalDate|Date/.test(type)) return "01-04-2025";
    return depth > 2 ? null : "string";
}

function exampleBody(endpoint) {
    if (!endpoint.parameters.body) return null;
    if (!endpoint.requestModel) return exampleValue(endpoint.parameters.body.type);
    const object = {};
    for (const field of endpoint.requestModel.fields) object[field.name] = exampleValue(field.type, field.allowedValues, 1);
    return object;
}

function curlFor(endpoint) {
    const method = endpoint.method === "ANY" ? "POST" : endpoint.method;
    const url = `${API_BASE}${resolveExamplePath(endpoint.path)}${queryFor(endpoint)}`;
    const lines = [
        `curl --request ${method} \\`,
        `  --url '${url}' \\`,
        `  --header 'Auth-Key: ${AUTH_KEY}' \\`,
        `  --header 'Accept: ${/APPLICATION_PDF|application\/pdf/i.test(endpoint.produces ?? "") ? "application/pdf" : "application/json"}'`
    ];
    if (endpoint.parameters.parts.length || /multipart/i.test(endpoint.consumes ?? "")) {
        lines[lines.length - 1] += " \\";
        for (let i = 0; i < endpoint.parameters.parts.length; i++) {
            const part = endpoint.parameters.parts[i];
            lines.push(`  --form '${part.name}=@/path/to/file'${i < endpoint.parameters.parts.length - 1 ? " \\" : ""}`);
        }
    } else if (endpoint.parameters.body) {
        lines[lines.length - 1] += " \\";
        lines.push("  --header 'Content-Type: application/json' \\");
        lines.push(`  --data '${JSON.stringify(exampleBody(endpoint))}'`);
    }
    return lines.join("\n");
}

function formatInputs(endpoint) {
    const sections = [];
    const render = (title, items) => {
        if (!items.length) return;
        sections.push(`**${title}**`);
        for (const item of items) {
            const details = [
                `type: \`${item.type}\``,
                item.required ? "required" : "optional",
                item.defaultValue !== null && item.defaultValue !== undefined ? `default: \`${item.defaultValue}\`` : null,
                item.allowedValues?.length ? `allowed: ${item.allowedValues.map((value) => `\`${value}\``).join(", ")}` : null
            ].filter(Boolean).join("; ");
            sections.push(`- \`${item.name}\` — ${details}`);
        }
    };
    render("Path parameters", endpoint.parameters.path);
    render("Query parameters", endpoint.parameters.query);
    render("Request headers", endpoint.parameters.headers);
    render("Multipart parts", endpoint.parameters.parts);
    if (!sections.length && !endpoint.parameters.body) sections.push("No request inputs.");
    return sections.join("\n");
}

function formatBody(endpoint) {
    if (!endpoint.parameters.body) return "None.";
    const intro = `Type: \`${endpoint.parameters.body.type}\` (${endpoint.parameters.body.required ? "required" : "optional"}).`;
    if (!endpoint.requestModel) {
        const note = JAVA_PRIMITIVES.has(baseType(endpoint.parameters.body.type))
            ? "No finite field/value contract is declared by the controller."
            : "Model fields could not be statically resolved; inspect the cited controller/model before integration.";
        return `${intro}\n\n${note}\n\nExample:\n\n\`\`\`json\n${JSON.stringify(exampleBody(endpoint), null, 2)}\n\`\`\``;
    }
    const rows = endpoint.requestModel.fields.map((field) => {
        const allowed = field.allowedValues.length ? field.allowedValues.join(", ") : "unconstrained";
        const constraints = field.constraints.length ? field.constraints.join(", ") : field.required ? "required" : "not declared";
        return `| \`${field.name}\` | \`${field.type}\` | ${constraints} | ${allowed} |`;
    }).join("\n");
    return `${intro}\n\n| Field | Type | Validation | Allowed values |\n|---|---|---|---|\n${rows}\n\nExample:\n\n\`\`\`json\n${JSON.stringify(exampleBody(endpoint), null, 2)}\n\`\`\``;
}

function renderBackendEndpoint(endpoint, headingLevel = 3) {
    const anyNote = endpoint.method === "ANY" ? " (mapping does not restrict the HTTP method)" : "";
    return `${"#".repeat(headingLevel)} \`${endpoint.method} ${endpoint.path}\`

${endpoint.description}

- **Controller:** \`${endpoint.controller}#${endpoint.handler}\`
- **Source:** \`${endpoint.sourceFile}:${endpoint.sourceLine}\`
- **Deprecated:** ${endpoint.deprecated ? "**Yes**" : "No"}
- **Consumes:** ${endpoint.consumes ? `\`${endpoint.consumes}\`` : "not declared"}
- **Produces:** ${endpoint.produces ? `\`${endpoint.produces}\`` : "not declared"}
- **Authentication:** \`Auth-Key\` (or service-supported session authentication)${anyNote}

#### Inputs

${formatInputs(endpoint)}

#### Request payload

${formatBody(endpoint)}

${formatResponseSection(endpoint.response)}

#### curl

\`\`\`bash
${curlFor(endpoint)}
\`\`\`
`;
}

function writeBackendDocs(service, extraction) {
    const endpoints = [...extraction.endpoints].sort((a, b) =>
        a.path.localeCompare(b.path) || a.method.localeCompare(b.method) || a.controller.localeCompare(b.controller));
    const deprecatedCount = endpoints.filter((endpoint) => endpoint.deprecated).length;
    const content = `# ${service.title} Controller API

Generated from production Spring controllers in \`${service.root}\`. Values are finite only when supported by controller annotations, Java enums, DTO constraints, or explicit validation evidence; otherwise they are marked unconstrained.

| Metric | Count |
|---|---:|
| Controllers | ${extraction.controllers} |
| Handler methods | ${extraction.handlers} |
| Expanded routes | ${endpoints.length} |
| Deprecated routes | ${deprecatedCount} |

${endpoints.map((endpoint) => renderBackendEndpoint(endpoint)).join("\n---\n\n")}
`;
    fs.writeFileSync(path.join(BACKEND_DOCS, service.doc), content);
}

function renderUsedMatch(match) {
    const primary = match.backend[0];
    const owners = match.backend.map((endpoint) => `${endpoint.service}: ${endpoint.controller}#${endpoint.handler}`).join("; ");
    const response = enrichResponseWithFrontendFields(primary.response, match.frontend.previousResponse);
    return `### \`${match.frontend.method} ${match.frontend.path}\`

- **Frontend id:** \`${match.frontend.id}\`
- **Frontend evidence:** \`${match.frontend.sourceEvidence}\`
- **Method evidence:** ${match.frontend.methodEvidence}
- **Backend match:** ${owners}
- **Backend source:** \`${primary.sourceFile}:${primary.sourceLine}\`
- **Deprecated:** ${match.backend.some((endpoint) => endpoint.deprecated) ? "**Yes**" : "No"}

${primary.description}

#### Inputs

${formatInputs(primary)}

#### Controller-backed request payload

${formatBody(primary)}

${formatResponseSection(response)}

**Frontend-consumed response evidence**

${match.frontend.previousResponse || "No response-field evidence was discovered in the frontend inventory."}

#### curl

\`\`\`bash
${curlFor(primary)}
\`\`\`
`;
}

function writeFrontendUsed(matched) {
    const groups = new Map();
    for (const match of matched) {
        if (!groups.has(match.frontend.domainFile)) groups.set(match.frontend.domainFile, []);
        groups.get(match.frontend.domainFile).push(match);
    }
    const links = [];
    for (const [domainFile, matches] of [...groups.entries()].sort()) {
        const out = domainFile.replace(".md", "-verified.md");
        links.push(`- [${domainFile}](./${out}) (${matches.length})`);
        const body = `# Backend-Verified Frontend APIs: ${domainFile}

Only exact HTTP method + normalized controller-path matches are included.

${matches.sort((a, b) => a.frontend.id.localeCompare(b.frontend.id)).map(renderUsedMatch).join("\n---\n\n")}
`;
        fs.writeFileSync(path.join(USED_DOCS, out), body);
    }
    fs.writeFileSync(path.join(USED_DOCS, "README.md"), `# Backend-Verified Frontend APIs

Frontend calls matched exactly to one or more backend controllers.

${links.join("\n")}
`);
}

function renderCompactEndpoint(endpoint) {
    return `- \`${endpoint.method} ${endpoint.path}\` — ${endpoint.service} · \`${endpoint.controller}#${endpoint.handler}\` · \`${endpoint.sourceFile}:${endpoint.sourceLine}\`${endpoint.deprecated ? " · **deprecated**" : ""}`;
}

function writeCoverage(comparison, backend) {
    const notUsed = `# Backend APIs Not Used by Frontend

These controller routes have no exact frontend method/path match. **Not used does not mean deprecated.**

Total: **${comparison.backendNotUsed.length}**

${comparison.backendNotUsed.sort((a, b) => a.service.localeCompare(b.service) || a.path.localeCompare(b.path)).map(renderCompactEndpoint).join("\n")}
`;
    fs.writeFileSync(path.join(COVERAGE_DOCS, "backend-not-used.md"), notUsed);

    const unmatched = `# Frontend APIs Without a Backend Controller Match

These calls did not match any of the four checked backend snapshots by exact normalized method/path.

Total: **${comparison.unmatched.length}**

${comparison.unmatched.map((item) => {
        const suggestions = [...item.samePath, ...item.near].slice(0, 5);
        return `## \`${item.frontend.method} ${item.frontend.path}\`

- Frontend id: \`${item.frontend.id}\`
- Evidence: \`${item.frontend.sourceEvidence}\`
- Candidates: ${suggestions.length ? suggestions.map((candidate) => `\`${candidate.method} ${candidate.path}\` (${candidate.service})`).join(", ") : "none"}
`;
    }).join("\n")}
`;
    fs.writeFileSync(path.join(COVERAGE_DOCS, "frontend-unmatched.md"), unmatched);

    const deprecated = backend.filter((endpoint) => endpoint.deprecated);
    fs.writeFileSync(path.join(COVERAGE_DOCS, "deprecated.md"), `# Explicitly Deprecated Backend APIs

Only Java \`@Deprecated\` or Javadoc \`@deprecated\` controller methods appear here. Backend-not-used routes are not automatically deprecated.

Total expanded deprecated routes: **${deprecated.length}**

${deprecated.sort((a, b) => a.service.localeCompare(b.service) || a.path.localeCompare(b.path)).map((endpoint) => {
        const used = comparison.matched.some((match) => match.backend.some((candidate) => backendIdentity(candidate) === backendIdentity(endpoint)));
        return `${renderCompactEndpoint(endpoint)} · frontend used: **${used ? "yes" : "no"}**`;
    }).join("\n")}
`);

    const serializable = {
        rules: {
            matchKey: "HTTP method + normalized path",
            placeholderNamesIgnored: true,
            queryIgnoredForRouteMatch: true,
            backendNotUsedDoesNotMeanDeprecated: true
        },
        counts: {
            frontend: comparison.matched.length + comparison.unmatched.length,
            matchedFrontend: comparison.matched.length,
            frontendUnmatched: comparison.unmatched.length,
            backend: backend.length,
            backendNotUsed: comparison.backendNotUsed.length,
            deprecated: deprecated.length
        },
        matched: comparison.matched.map((item) => ({
            frontend: item.frontend,
            backend: item.backend.map(publicEndpoint)
        })),
        frontendUnmatched: comparison.unmatched.map((item) => ({
            frontend: item.frontend,
            samePath: item.samePath.map(publicEndpoint),
            near: item.near.map(publicEndpoint)
        })),
        backendNotUsed: comparison.backendNotUsed.map(publicEndpoint),
        deprecated: deprecated.map(publicEndpoint)
    };
    fs.writeFileSync(path.join(COVERAGE_DOCS, "comparison.json"), JSON.stringify(serializable, null, 2));
    fs.writeFileSync(
        path.join(COVERAGE_DOCS, "catalog.json"),
        JSON.stringify(buildExplorerCatalog(comparison, backend), null, 2)
    );

    fs.writeFileSync(path.join(COVERAGE_DOCS, "README.md"), `# Frontend / Backend API Coverage

| Classification | Count |
|---|---:|
| Frontend calls inventoried | ${serializable.counts.frontend} |
| Exact frontend/backend matches | ${serializable.counts.matchedFrontend} |
| Frontend unmatched | ${serializable.counts.frontendUnmatched} |
| Backend expanded routes | ${serializable.counts.backend} |
| Backend routes not used by frontend | ${serializable.counts.backendNotUsed} |
| Explicitly deprecated expanded routes | ${serializable.counts.deprecated} |

- [Backend not used](./backend-not-used.md)
- [Frontend unmatched](./frontend-unmatched.md)
- [Deprecated](./deprecated.md)
- Machine-readable evidence: \`comparison.json\`
`);
}

function buildExplorerCatalog(comparison, backend) {
    const frontendUsage = new Map();
    for (const match of comparison.matched) {
        for (const endpoint of match.backend) {
            const identity = backendIdentity(endpoint);
            if (!frontendUsage.has(identity)) frontendUsage.set(identity, []);
            frontendUsage.get(identity).push({
                id: match.frontend.id,
                method: match.frontend.method,
                path: match.frontend.path,
                domainFile: match.frontend.domainFile,
                sourceEvidence: match.frontend.sourceEvidence,
                methodEvidence: match.frontend.methodEvidence,
                responseFieldsUsed: match.frontend.previousResponse
            });
        }
    }

    const records = backend.map((endpoint) => {
        const usedBy = frontendUsage.get(backendIdentity(endpoint)) ?? [];
        const frontendFields = usedBy.map((usage) => usage.responseFieldsUsed).filter(Boolean).join("\n");
        return {
            id: backendIdentity(endpoint),
            classification: usedBy.length ? "frontend-used" : "backend-not-used",
            deprecated: endpoint.deprecated,
            service: endpoint.service,
            serviceTitle: endpoint.serviceTitle,
            controller: endpoint.controller,
            handler: endpoint.handler,
            method: endpoint.method,
            path: endpoint.path,
            normalizedPath: normalizeRoute(endpoint.path),
            description: endpoint.description,
            sourceFile: endpoint.sourceFile,
            sourceLine: endpoint.sourceLine,
            consumes: endpoint.consumes,
            produces: endpoint.produces,
            parameters: endpoint.parameters,
            requestBody: endpoint.parameters.body
                ? {
                    ...endpoint.parameters.body,
                    fields: endpoint.requestModel?.fields ?? [],
                    example: exampleBody(endpoint)
                }
                : null,
            response: enrichResponseWithFrontendFields(endpoint.response, frontendFields),
            frontendUsage: usedBy,
            curl: curlFor(endpoint),
            documentationFile: `backend/${SERVICES.find((service) => service.id === endpoint.service)?.doc}`
        };
    });

    for (const item of comparison.unmatched) {
        const frontend = item.frontend;
        records.push({
            id: `frontend-unmatched:${frontend.id}:${frontend.method}:${frontend.path}`,
            classification: "frontend-unmatched",
            deprecated: false,
            service: "frontend-unmatched",
            serviceTitle: "Frontend unmatched",
            controller: null,
            handler: null,
            method: frontend.method,
            path: stripTrailingSlash(frontend.path),
            normalizedPath: normalizeRoute(frontend.path),
            description: `Frontend call without an exact controller match: ${frontend.id}`,
            sourceFile: frontend.sourceEvidence,
            sourceLine: null,
            consumes: null,
            produces: null,
            parameters: {
                path: [...frontend.path.matchAll(/:([A-Za-z_]\w*)|\{\{([^}]+)}}/g)].map((match) => ({
                    name: match[1] || match[2],
                    type: "String",
                    required: true,
                    allowedValues: []
                })),
                query: parseFrontendQueryParameters(frontend.path),
                headers: [],
                parts: [],
                body: frontend.previousPayload && frontend.previousPayload !== "none"
                    ? { type: "frontend payload evidence", required: false }
                    : null
            },
            requestBody: frontend.previousPayload && frontend.previousPayload !== "none"
                ? { type: "frontend payload evidence", required: false, fields: [], example: parseFrontendPayload(frontend.previousPayload) }
                : null,
            response: {
                envelope: "frontend evidence only",
                declaredType: "unmatched",
                bodyEvidence: frontend.previousResponse || "unknown",
                status: "unknown",
                httpStatus: null,
                successExample: {
                    status: "success",
                    body: "Frontend unmatched — inspect live response or backend candidates"
                },
                errorExamples: [{
                    httpStatus: 400,
                    httpStatusName: "BAD_REQUEST",
                    code: "UNKNOWN",
                    message: "No exact backend controller match for this frontend call.",
                    exception: "UnmatchedFrontendCall",
                    when: "Frontend path could not be matched to a Spring controller",
                    example: {
                        status: "error",
                        code: "UNKNOWN",
                        message: "No exact backend controller match for this frontend call."
                    }
                }],
                possibleErrors: [{
                    httpStatus: 400,
                    code: "UNKNOWN",
                    exception: "UnmatchedFrontendCall",
                    when: "Frontend path could not be matched to a Spring controller"
                }]
            },
            frontendUsage: [{
                id: frontend.id,
                method: frontend.method,
                path: frontend.path,
                domainFile: frontend.domainFile,
                sourceEvidence: frontend.sourceEvidence,
                methodEvidence: frontend.methodEvidence,
                responseFieldsUsed: frontend.previousResponse
            }],
            matchCandidates: [...item.samePath, ...item.near].slice(0, 5).map(publicEndpoint),
            curl: null,
            documentationFile: "coverage/frontend-unmatched.md"
        });
    }

    return {
        version: 1,
        generatedFrom: "Spring controllers and frontend HTTP call sites",
        defaults: {
            baseUrl: API_BASE,
            companyUniqueName: "",
            branchUniqueName: "",
            authKey: ""
        },
        counts: {
            records: records.length,
            backend: backend.length,
            frontendUsedBackendRoutes: backend.length - comparison.backendNotUsed.length,
            backendNotUsed: comparison.backendNotUsed.length,
            frontendUnmatched: comparison.unmatched.length,
            deprecated: backend.filter((endpoint) => endpoint.deprecated).length
        },
        records
    };
}

function parseFrontendQueryParameters(route) {
    const query = route.split("?")[1];
    if (!query) return [];
    return query.split("&").filter(Boolean).map((pair) => {
        const [name, rawValue = ""] = pair.split("=");
        const placeholder = /^:([A-Za-z_]\w*)$/.exec(rawValue)?.[1];
        return {
            name,
            type: "String",
            required: false,
            defaultValue: placeholder ? null : decodeURIComponent(rawValue),
            allowedValues: []
        };
    });
}

function parseFrontendPayload(payload) {
    const trimmed = payload.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
            return JSON.parse(trimmed.replace(/'/g, "\""));
        } catch {
            return {};
        }
    }
    return {};
}

function publicEndpoint(endpoint) {
    return {
        service: endpoint.service,
        controller: endpoint.controller,
        handler: endpoint.handler,
        method: endpoint.method,
        path: endpoint.path,
        normalizedPath: normalizeRoute(endpoint.path),
        deprecated: endpoint.deprecated,
        sourceFile: endpoint.sourceFile,
        sourceLine: endpoint.sourceLine
    };
}

function updateReadme(serviceExtractions, comparison) {
    const existing = fs.readFileSync(path.join(DOCS, "README.md"), "utf8");
    const marker = "## Backend-verified documentation";
    const base = existing.includes(marker) ? existing.slice(0, existing.indexOf(marker)).trimEnd() : existing.trimEnd();
    const serviceLinks = SERVICES.map((service) => {
        const extraction = serviceExtractions.get(service.id);
        return `- [${service.title}](./backend/${service.doc}) (${extraction.endpoints.length} expanded routes)`;
    }).join("\n");
    fs.writeFileSync(path.join(DOCS, "README.md"), `${base}

## Backend-verified documentation

The following contracts are generated from the four Spring controller codebases. They are authoritative for method/path, controller inputs, finite allowed values, and deprecation evidence.

${serviceLinks}

- [Backend-verified frontend APIs](./frontend-used/README.md) (${comparison.matched.length} exact matches)
- [Frontend/backend coverage](./coverage/README.md)
- [Frontend unmatched](./coverage/frontend-unmatched.md) (${comparison.unmatched.length})
- [Backend not used by frontend](./coverage/backend-not-used.md) (${comparison.backendNotUsed.length})
- [Explicitly deprecated](./coverage/deprecated.md)

Regenerate:

\`\`\`bash
node scripts/generate-backend-verified-api-docs.mjs
\`\`\`
`);
}

function verifyOutputs(serviceExtractions, frontend, backend, comparison) {
    const errors = [];
    if (comparison.matched.length + comparison.unmatched.length !== frontend.length) errors.push("frontend classification is incomplete");
    const classifiedBackend = new Set([
        ...comparison.backendNotUsed.map(backendIdentity),
        ...comparison.matched.flatMap((match) => match.backend.map(backendIdentity))
    ]);
    if (backend.some((endpoint) => !classifiedBackend.has(backendIdentity(endpoint)))) errors.push("backend classification is incomplete");
    for (const service of SERVICES) {
        const extraction = serviceExtractions.get(service.id);
        if (!extraction?.endpoints.length) errors.push(`${service.id}: no endpoints extracted`);
        const doc = fs.readFileSync(path.join(BACKEND_DOCS, service.doc), "utf8");
        const sections = (doc.match(/^### `/gm) || []).length;
        if (sections !== extraction.endpoints.length) errors.push(`${service.id}: ${sections} sections != ${extraction.endpoints.length} routes`);
    }
    const generated = [
        ...walk(BACKEND_DOCS, (file) => file.endsWith(".md")),
        ...walk(USED_DOCS, (file) => file.endsWith(".md")),
        ...walk(COVERAGE_DOCS, (file) => file.endsWith(".md"))
    ];
    for (const file of generated) {
        const source = fs.readFileSync(file, "utf8");
        if (source.includes("<unresolved:")) errors.push(`${path.relative(ROOT, file)} contains unresolved mapping`);
        const curlUrls = [...source.matchAll(/--url '([^']+)'/g)].map((match) => match[1]);
        if (curlUrls.some((url) => url.includes("{{company") || /:companyUniqueName\b/.test(url))) {
            errors.push(`${path.relative(ROOT, file)} contains unresolved curl company placeholder`);
        }
    }
    const report = {
        ok: errors.length === 0,
        errors,
        services: Object.fromEntries(SERVICES.map((service) => {
            const extraction = serviceExtractions.get(service.id);
            return [service.id, {
                controllers: extraction.controllers,
                handlers: extraction.handlers,
                expandedRoutes: extraction.endpoints.length
            }];
        })),
        frontend: {
            total: frontend.length,
            matched: comparison.matched.length,
            unmatched: comparison.unmatched.length
        },
        backend: {
            total: backend.length,
            notUsed: comparison.backendNotUsed.length,
            deprecated: backend.filter((endpoint) => endpoint.deprecated).length
        }
    };
    fs.writeFileSync(path.join(COVERAGE_DOCS, "verification.json"), JSON.stringify(report, null, 2));
    if (errors.length) throw new Error(`Verification failed:\n${errors.join("\n")}`);
    return report;
}

function main() {
    for (const dir of [BACKEND_DOCS, USED_DOCS, COVERAGE_DOCS]) fs.mkdirSync(dir, { recursive: true });
    const serviceExtractions = new Map();
    const backend = [];
    for (const service of SERVICES) {
        if (!fs.existsSync(service.root)) throw new Error(`Missing service repository: ${service.root}`);
        const extraction = extractServiceEndpoints(service);
        serviceExtractions.set(service.id, extraction);
        backend.push(...extraction.endpoints);
        writeBackendDocs(service, extraction);
        console.log(`${service.id}: ${extraction.controllers} controllers, ${extraction.endpoints.length} expanded routes`);
    }
    const frontend = parseFrontendDocs();
    const comparison = matchFrontend(frontend, backend);
    writeFrontendUsed(comparison.matched);
    writeCoverage(comparison, backend);
    updateReadme(serviceExtractions, comparison);
    const report = verifyOutputs(serviceExtractions, frontend, backend, comparison);
    console.log(JSON.stringify(report, null, 2));
}

main();
