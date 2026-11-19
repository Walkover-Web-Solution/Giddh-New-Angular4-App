const STORAGE_KEY = "giddh-api-explorer-environment-v1";
const DEFAULT_AUTH_KEY = "ENTER_YOUR_GIDDH_AUTH_KEY";
const DEFAULT_SESSION_ID = "ENTER_YOUR_GIDDH_SESSION_ID";
const SHAREABLE_QUERY_KEYS = {
    base_url: "baseUrl",
    baseUrl: "baseUrl",
    companyUniqueName: "companyUniqueName",
    company_unique_name: "companyUniqueName",
    branchUniqueName: "branchUniqueName",
    branch_unique_name: "branchUniqueName",
    origin: "origin"
};
const SECRET_QUERY_KEYS = new Set([
    "authkey", "auth_key", "auth-key", "authKey",
    "sessionid", "session_id", "session-id", "sessionId"
]);
let searchUrlSyncTimer = null;

const state = {
    catalog: null,
    filtered: [],
    selected: null,
    pathValues: {},
    queryValues: {},
    customHeaders: {},
    partValues: {},
    body: null,
    requestMethod: "GET"
};

const $ = (selector) => document.querySelector(selector);
const elements = {
    baseUrl: $("#base-url"),
    company: $("#company-unique-name"),
    branch: $("#branch-unique-name"),
    authKey: $("#auth-key"),
    sessionId: $("#session-id"),
    origin: $("#origin-header"),
    environmentFields: $("#environment-fields"),
    toggleEnvironment: $("#toggle-environment"),
    shareEnvironment: $("#share-environment"),
    shareEnvironmentInline: $("#share-environment-inline"),
    showCatalogPanel: $("#show-catalog-panel"),
    showDetailPanel: $("#show-detail-panel"),
    workspace: $(".workspace"),
    search: $("#search"),
    classification: $("#classification-filter"),
    service: $("#service-filter"),
    method: $("#method-filter"),
    deprecated: $("#deprecated-filter"),
    count: $("#catalog-count"),
    list: $("#endpoint-list"),
    empty: $("#empty-state"),
    workbench: $("#request-workbench"),
    methodBadge: $("#method-badge"),
    classificationBadge: $("#classification-badge"),
    deprecatedBadge: $("#deprecated-badge"),
    title: $("#endpoint-title"),
    description: $("#endpoint-description"),
    sourceDocLink: $("#source-doc-link"),
    metadataService: $("#metadata-service"),
    metadataController: $("#metadata-controller"),
    metadataFrontend: $("#metadata-frontend"),
    metadataSource: $("#metadata-source"),
    pathFields: $("#path-fields"),
    queryFields: $("#query-fields"),
    headerFields: $("#header-fields"),
    methodFields: $("#method-fields"),
    requestMethod: $("#request-method"),
    partFields: $("#part-fields"),
    bodyFields: $("#body-fields"),
    requestUrl: $("#request-url"),
    bodyEditorLabel: $("#body-editor-label"),
    bodyEditor: $("#body-editor"),
    bodyError: $("#body-error"),
    sendRequest: $("#send-request"),
    copyCurl: $("#copy-curl"),
    curlPreview: $("#curl-preview"),
    requestStatus: $("#request-status"),
    responseMeta: $("#response-meta"),
    responsePanel: $("#response-panel"),
    responseExamplesSection: $("#response-examples-section"),
    responseExamplesMeta: $("#response-examples-meta"),
    successExampleStatus: $("#success-example-status"),
    successExamplePanel: $("#success-example-panel"),
    errorExampleSelect: $("#error-example-select"),
    errorExamplePanel: $("#error-example-panel"),
    resetRequest: $("#reset-request"),
    exportSelected: $("#export-selected"),
    exportFiltered: $("#export-filtered"),
    toast: $("#toast")
};

init();

async function init() {
    try {
        const response = await fetch("/data/catalog.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
        state.catalog = await response.json();
        loadEnvironment();
        populateFilters();
        const apiIdFromUrl = readCatalogFromUrl();
        bindEvents();
        filterCatalog();
        selectEndpointFromUrl(apiIdFromUrl);
        setupMobileLayout();
    } catch (error) {
        elements.empty.replaceChildren(createTextElement("h2", "Could not load API catalog"), createTextElement("p", error.message));
    }
}

function environment() {
    return {
        baseUrl: elements.baseUrl.value.trim().replace(/\/+$/, ""),
        companyUniqueName: elements.company.value.trim(),
        branchUniqueName: elements.branch.value.trim(),
        authKey: elements.authKey.value.trim(),
        sessionId: elements.sessionId.value.trim(),
        origin: elements.origin.value.trim()
    };
}

function readStoredEnvironment() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function readShareQueryEnvironment() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = {};
    let touched = false;
    let ignoredSecret = false;
    for (const [rawKey, rawValue] of params.entries()) {
        const key = rawKey.trim();
        if (SECRET_QUERY_KEYS.has(key) || SECRET_QUERY_KEYS.has(key.toLowerCase())) {
            ignoredSecret = true;
            touched = true;
            continue;
        }
        const mapped = SHAREABLE_QUERY_KEYS[key] || SHAREABLE_QUERY_KEYS[key.toLowerCase()];
        if (!mapped) continue;
        fromQuery[mapped] = rawValue.trim();
        touched = true;
    }
    if (touched) clearShareQueryParameters();
    if (ignoredSecret) showToast("Auth/Session values in the URL were ignored for safety.");
    return fromQuery;
}

function clearShareQueryParameters() {
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of [...url.searchParams.keys()]) {
        const normalized = key.trim();
        if (
            SHAREABLE_QUERY_KEYS[normalized]
            || SHAREABLE_QUERY_KEYS[normalized.toLowerCase()]
            || SECRET_QUERY_KEYS.has(normalized)
            || SECRET_QUERY_KEYS.has(normalized.toLowerCase())
        ) {
            url.searchParams.delete(key);
            changed = true;
        }
    }
    if (changed) window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function loadEnvironment() {
    const stored = readStoredEnvironment();
    const fromQuery = readShareQueryEnvironment();
    const defaults = state.catalog.defaults || {};
    elements.baseUrl.value = fromQuery.baseUrl || stored.baseUrl || defaults.baseUrl || "https://apitest.giddh.com";
    elements.company.value = fromQuery.companyUniqueName ?? stored.companyUniqueName ?? "";
    elements.branch.value = fromQuery.branchUniqueName ?? stored.branchUniqueName ?? "";
    elements.authKey.value = stored.authKey || defaults.authKey || DEFAULT_AUTH_KEY;
    elements.sessionId.value = stored.sessionId || defaults.sessionId || DEFAULT_SESSION_ID;
    elements.origin.value = fromQuery.origin ?? stored.origin ?? "";
    saveEnvironment();
}

function saveEnvironment() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(environment()));
}

function buildShareUrl() {
    const url = new URL(window.location.origin + window.location.pathname);
    applyEnvironmentParamsToUrl(url);
    applyCatalogParamsToUrl(url);
    return url.toString();
}

function applyEnvironmentParamsToUrl(url) {
    const env = environment();
    if (env.baseUrl) url.searchParams.set("base_url", env.baseUrl);
    else url.searchParams.delete("base_url");
    if (env.companyUniqueName) url.searchParams.set("companyUniqueName", env.companyUniqueName);
    else url.searchParams.delete("companyUniqueName");
    if (env.branchUniqueName) url.searchParams.set("branchUniqueName", env.branchUniqueName);
    else url.searchParams.delete("branchUniqueName");
    if (env.origin) url.searchParams.set("origin", env.origin);
    else url.searchParams.delete("origin");
}

function readCatalogFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("q")) elements.search.value = params.get("q") ?? "";
    if (params.has("classification")) {
        const value = params.get("classification") ?? "";
        if ([...elements.classification.options].some((option) => option.value === value)) {
            elements.classification.value = value;
        }
    }
    if (params.has("service")) {
        const value = params.get("service") ?? "";
        if ([...elements.service.options].some((option) => option.value === value)) {
            elements.service.value = value;
        }
    }
    if (params.has("method")) {
        const value = params.get("method") ?? "";
        if ([...elements.method.options].some((option) => option.value === value)) {
            elements.method.value = value;
        }
    }
    elements.deprecated.checked = params.get("deprecated") === "1";
    return params.get("api") || "";
}

function applyCatalogParamsToUrl(url) {
    const query = elements.search.value.trim();
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");

    if (elements.classification.value) url.searchParams.set("classification", elements.classification.value);
    else url.searchParams.delete("classification");

    if (elements.service.value) url.searchParams.set("service", elements.service.value);
    else url.searchParams.delete("service");

    if (elements.method.value) url.searchParams.set("method", elements.method.value);
    else url.searchParams.delete("method");

    if (elements.deprecated.checked) url.searchParams.set("deprecated", "1");
    else url.searchParams.delete("deprecated");

    if (state.selected?.id) url.searchParams.set("api", state.selected.id);
    else url.searchParams.delete("api");
}

function syncCatalogToUrl() {
    const url = new URL(window.location.href);
    applyCatalogParamsToUrl(url);
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) {
        window.history.replaceState({ explorerCatalog: true }, "", next);
    }
}

function scheduleSearchUrlSync() {
    clearTimeout(searchUrlSyncTimer);
    searchUrlSyncTimer = setTimeout(syncCatalogToUrl, 250);
}

function selectEndpointFromUrl(apiId) {
    if (!apiId || !state.catalog) return;
    const record = state.catalog.records.find((item) => item.id === apiId);
    if (record) selectEndpoint(record);
}

function restoreCatalogFromHistory() {
    const apiId = readCatalogFromUrl();
    filterCatalog();
    if (apiId) {
        selectEndpointFromUrl(apiId);
        return;
    }
    state.selected = null;
    elements.empty.hidden = false;
    elements.workbench.hidden = true;
    renderEndpointList();
}

async function shareEnvironment() {
    const shareUrl = buildShareUrl();
    try {
        if (navigator.share) {
            await navigator.share({ title: "Giddh API Explorer", url: shareUrl });
            showToast("Share sheet opened.");
            return;
        }
    } catch (error) {
        if (error?.name === "AbortError") return;
    }
    await navigator.clipboard.writeText(shareUrl);
    showToast("Share URL copied (no Auth-Key).");
}

function setupMobileLayout() {
    const narrow = window.matchMedia("(max-width: 800px)");
    const sync = () => {
        if (!narrow.matches) {
            elements.workspace.dataset.mobilePanel = "both";
            return;
        }
        if (!elements.workspace.dataset.mobilePanel || elements.workspace.dataset.mobilePanel === "both") {
            elements.workspace.dataset.mobilePanel = "catalog";
        }
        updateMobileTabs();
    };
    narrow.addEventListener("change", sync);
    sync();
}

function setMobilePanel(panel) {
    elements.workspace.dataset.mobilePanel = panel;
    updateMobileTabs();
}

function updateMobileTabs() {
    const panel = elements.workspace.dataset.mobilePanel;
    elements.showCatalogPanel.setAttribute("aria-selected", String(panel === "catalog"));
    elements.showDetailPanel.setAttribute("aria-selected", String(panel === "detail"));
}

function populateFilters() {
    const services = [...new Set(state.catalog.records.map((record) => record.service))].sort();
    const methods = [...new Set(state.catalog.records.map((record) => record.method))].sort();
    for (const service of services) elements.service.append(new Option(service, service));
    for (const method of methods) elements.method.append(new Option(method, method));
}

function bindEvents() {
    elements.search.addEventListener("input", () => {
        filterCatalog();
        scheduleSearchUrlSync();
    });
    for (const control of [elements.classification, elements.service, elements.method, elements.deprecated]) {
        control.addEventListener("input", () => {
            filterCatalog();
            syncCatalogToUrl();
        });
        control.addEventListener("change", () => {
            filterCatalog();
            syncCatalogToUrl();
        });
    }
    window.addEventListener("popstate", restoreCatalogFromHistory);
    for (const control of [elements.baseUrl, elements.company, elements.branch, elements.authKey, elements.sessionId, elements.origin]) {
        control.addEventListener("input", () => {
            saveEnvironment();
            applyEnvironmentDefaults();
            updateRequestPreview();
        });
    }
    elements.toggleEnvironment.addEventListener("click", () => {
        const expanded = elements.toggleEnvironment.getAttribute("aria-expanded") === "true";
        elements.toggleEnvironment.setAttribute("aria-expanded", String(!expanded));
        elements.toggleEnvironment.textContent = expanded ? "Expand" : "Collapse";
        elements.environmentFields.hidden = expanded;
    });
    elements.shareEnvironment.addEventListener("click", shareEnvironment);
    elements.shareEnvironmentInline.addEventListener("click", shareEnvironment);
    elements.showCatalogPanel.addEventListener("click", () => setMobilePanel("catalog"));
    elements.showDetailPanel.addEventListener("click", () => setMobilePanel("detail"));
    elements.bodyEditor.addEventListener("input", handleBodyEditor);
    elements.requestMethod.addEventListener("change", () => {
        state.requestMethod = elements.requestMethod.value;
        elements.methodBadge.textContent = state.requestMethod;
        elements.methodBadge.dataset.method = state.requestMethod;
        updateCurl();
    });
    elements.requestUrl.addEventListener("input", updateCurl);
    elements.sendRequest.addEventListener("click", sendRequest);
    elements.copyCurl.addEventListener("click", copyCurl);
    elements.resetRequest.addEventListener("click", () => selectEndpoint(state.selected));
    elements.exportSelected.addEventListener("click", () => exportPostman(state.selected ? [state.selected] : []));
    elements.exportFiltered.addEventListener("click", () => exportPostman(state.filtered));
    elements.errorExampleSelect.addEventListener("change", showSelectedErrorExample);
}

function filterCatalog() {
    const query = elements.search.value.trim().toLowerCase();
    state.filtered = state.catalog.records.filter((record) => {
        const surfaceFilter = elements.classification.value;
        if (surfaceFilter === "backend-not-used" || surfaceFilter === "frontend-unmatched") {
            if (record.classification !== surfaceFilter) return false;
        } else if (surfaceFilter && !recordSurfaces(record).includes(surfaceFilter)) {
            return false;
        }
        if (elements.service.value && record.service !== elements.service.value) return false;
        if (elements.method.value && record.method !== elements.method.value) return false;
        if (elements.deprecated.checked && !record.deprecated) return false;
        if (!query) return true;
        return [
            record.method, record.path, record.service, record.controller, record.handler,
            record.description, record.sourceFile,
            ...(record.frontendUsage || []).flatMap((usage) => [usage.id, usage.sourceEvidence])
        ].filter(Boolean).join(" ").toLowerCase().includes(query);
    });
    elements.count.textContent = `${state.filtered.length.toLocaleString()} of ${state.catalog.records.length.toLocaleString()} APIs`;
    renderEndpointList();
    if (state.selected && !state.filtered.some((record) => record.id === state.selected.id)) {
        state.selected = null;
        elements.empty.hidden = false;
        elements.workbench.hidden = true;
        syncCatalogToUrl();
    }
}

function renderEndpointList() {
    const fragment = document.createDocumentFragment();
    for (const record of state.filtered) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "endpoint-card";
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", String(state.selected?.id === record.id));
        const badges = createTextElement("div", "");
        badges.className = "badges";
        badges.append(methodBadge(record.method), ...usageBadges(record));
        const route = createTextElement("span", record.path);
        route.className = "endpoint-card-path";
        const meta = createTextElement("span", "");
        meta.className = "endpoint-card-meta";
        meta.append(createTextElement("span", record.service), createTextElement("span", record.controller || "No backend match"));
        button.append(badges, route, meta);
        button.addEventListener("click", () => selectEndpoint(record));
        fragment.append(button);
    }
    elements.list.replaceChildren(fragment);
}

function methodBadge(method) {
    const badge = createTextElement("span", method);
    badge.className = "method-badge";
    badge.dataset.method = method;
    return badge;
}

const SURFACE_LABELS = {
    "giddh-panel": "Giddh Panel",
    "customer-portal": "Customer Portal",
    "magic-link": "Magic Link",
    "giddh-website": "Giddh Website"
};

function recordSurfaces(record) {
    if (Array.isArray(record.surfaces) && record.surfaces.length) return record.surfaces;
    if (record.classification === "frontend-used") return ["giddh-panel"];
    return [];
}

function usageBadges(record) {
    const surfaces = recordSurfaces(record);
    if (surfaces.length) {
        return surfaces.map((surface) => {
            const badge = createTextElement("span", SURFACE_LABELS[surface] || surface);
            badge.className = `status-badge surface-${surface}`;
            return badge;
        });
    }
    return [statusBadge(record.classification)];
}

function statusBadge(classification) {
    const badge = createTextElement("span", classificationLabel(classification));
    badge.className = `status-badge ${classification === "backend-not-used" ? "warning" : classification === "frontend-unmatched" ? "danger" : ""}`;
    return badge;
}

function classificationLabel(value) {
    return {
        "frontend-used": "Giddh Panel",
        "giddh-panel": "Giddh Panel",
        "customer-portal": "Customer Portal",
        "magic-link": "Magic Link",
        "giddh-website": "Giddh Website",
        "backend-not-used": "Backend unused",
        "frontend-unmatched": "Unmatched"
    }[value] || value;
}

function selectEndpoint(record) {
    if (!record) return;
    state.selected = record;
    state.requestMethod = record.method === "ANY" ? "POST" : record.method;
    state.pathValues = {};
    state.queryValues = {};
    state.customHeaders = {};
    state.partValues = {};
    state.body = structuredClone(record.requestBody?.example ?? null);
    const env = environment();
    for (const parameter of uniqueParameters(record.parameters?.path || [], extractPathParameters(record.path))) {
        state.pathValues[parameter.name] = defaultParameterValue(parameter, env);
    }
    for (const parameter of record.parameters?.query || []) state.queryValues[parameter.name] = defaultParameterValue(parameter, env);
    for (const parameter of record.parameters?.headers || []) {
        if (!["auth-key", "session-id", "origin"].includes(parameter.name.toLowerCase())) {
            state.customHeaders[parameter.name] = defaultParameterValue(parameter, env);
        }
    }
    for (const part of record.parameters?.parts || []) state.partValues[part.name] = null;
    renderEndpointList();
    renderWorkbench();
    syncCatalogToUrl();
    if (window.matchMedia("(max-width: 800px)").matches) setMobilePanel("detail");
}

function renderWorkbench() {
    const record = state.selected;
    elements.empty.hidden = true;
    elements.workbench.hidden = false;
    elements.methodBadge.textContent = state.requestMethod;
    elements.methodBadge.dataset.method = state.requestMethod;
    const surfaces = recordSurfaces(record);
    elements.classificationBadge.textContent = surfaces.length
        ? surfaces.map((surface) => SURFACE_LABELS[surface] || surface).join(" · ")
        : classificationLabel(record.classification);
    elements.classificationBadge.className = surfaces.length
        ? `status-badge surface-${surfaces[0]}`
        : statusBadge(record.classification).className;
    elements.deprecatedBadge.hidden = !record.deprecated;
    elements.methodFields.hidden = record.method !== "ANY";
    elements.requestMethod.value = state.requestMethod;
    elements.title.textContent = record.path;
    elements.description.textContent = record.description;
    elements.metadataService.textContent = record.serviceTitle || record.service;
    elements.metadataController.textContent = record.controller ? `${record.controller}#${record.handler}` : "No exact backend match";
    const usedBy = [
        ...recordSurfaces(record).map((surface) => SURFACE_LABELS[surface] || surface),
        ...(record.frontendUsage || []).map((usage) => usage.id)
    ];
    elements.metadataFrontend.textContent = usedBy.length ? usedBy.join(", ") : "Not used by Giddh Panel, Customer Portal, Magic Link, or Website";
    elements.metadataSource.textContent = record.sourceLine ? `${record.sourceFile}:${record.sourceLine}` : record.sourceFile;
    elements.sourceDocLink.href = `/docs/${record.documentationFile}`;
    elements.responseMeta.textContent = "";
    elements.responsePanel.dataset.state = "";
    elements.responsePanel.querySelector("code").textContent = "Select Send request to call the API.";
    renderResponseExamples();
    renderParameterGroups();
    renderPartFields();
    renderBodyFields();
    updateRequestPreview();
}

function exampleOrigin(item) {
    if (!item || typeof item !== "object") return "";
    if (item.source === "backend-predicted") {
        return item.liveVerified ? "Predicted, live-verified" : "Predicted";
    }
    if (typeof item.when === "string" && item.when.startsWith("Live capture")) return "Live";
    return "";
}

function renderResponseExamples() {
    const response = state.selected?.response;
    const preparedSuccess = response?.preparedSuccess;
    const liveSuccess = response?.successExample;
    const hasLiveSuccess = liveSuccess !== undefined && liveSuccess !== null;
    const successExample = hasLiveSuccess ? liveSuccess : preparedSuccess?.example;
    const successOrigin = hasLiveSuccess ? "Live" : (preparedSuccess ? "Predicted" : "");
    const errorExamples = Array.isArray(response?.errorExamples) ? response.errorExamples : [];
    const hasSuccess = successExample !== undefined && successExample !== null;
    const hasErrors = errorExamples.length > 0;

    if (!hasSuccess && !hasErrors) {
        elements.responseExamplesSection.hidden = true;
        elements.responseExamplesMeta.textContent = "";
        elements.successExampleStatus.textContent = "";
        elements.successExamplePanel.querySelector("code").textContent = "";
        elements.errorExampleSelect.replaceChildren();
        elements.errorExamplePanel.querySelector("code").textContent = "";
        return;
    }

    elements.responseExamplesSection.hidden = false;
    const statusLabel = hasLiveSuccess && response.httpStatus
        ? `${response.httpStatus}${response.status ? ` ${response.status}` : ""}`
        : (preparedSuccess?.httpStatus ? String(preparedSuccess.httpStatus) : (response.status || ""));
    const predictedErrors = errorExamples.filter((item) => item?.source === "backend-predicted").length;
    elements.responseExamplesMeta.textContent = [
        successOrigin && `Success ${successOrigin}`,
        statusLabel && statusLabel,
        response.envelope && `Envelope ${response.envelope}`,
        preparedSuccess?.bodyType && !hasLiveSuccess && preparedSuccess.bodyType,
        hasErrors && `${errorExamples.length} error${errorExamples.length === 1 ? "" : "s"}`,
        predictedErrors ? `${predictedErrors} predicted` : ""
    ].filter(Boolean).join(" · ");
    elements.successExampleStatus.textContent = [successOrigin, statusLabel].filter(Boolean).join(" · ");

    elements.successExamplePanel.querySelector("code").textContent = hasSuccess
        ? JSON.stringify(successExample, null, 2)
        : "No documented success example.";

    elements.errorExampleSelect.replaceChildren();
    if (!hasErrors) {
        elements.errorExampleSelect.disabled = true;
        elements.errorExamplePanel.querySelector("code").textContent = "No documented error examples.";
        return;
    }

    elements.errorExampleSelect.disabled = false;
    for (const [index, item] of errorExamples.entries()) {
        const option = document.createElement("option");
        option.value = String(index);
        const origin = exampleOrigin(item);
        option.textContent = [
            origin,
            item.httpStatus,
            item.code,
            item.exception
        ].filter(Boolean).join(" · ");
        if (item.when || item.message) option.title = item.when || item.message;
        elements.errorExampleSelect.append(option);
    }
    elements.errorExampleSelect.value = "0";
    showSelectedErrorExample();
}

function showSelectedErrorExample() {
    const errorExamples = state.selected?.response?.errorExamples || [];
    const index = Number(elements.errorExampleSelect.value);
    const item = errorExamples[index];
    if (!item) {
        elements.errorExamplePanel.querySelector("code").textContent = "No documented error examples.";
        return;
    }
    const payload = item.example ?? {
        status: "error",
        code: item.code,
        message: item.message
    };
    elements.errorExamplePanel.querySelector("code").textContent = JSON.stringify(payload, null, 2);
}

function uniqueParameters(...groups) {
    const result = new Map();
    for (const parameter of groups.flat()) if (!result.has(parameter.name)) result.set(parameter.name, parameter);
    return [...result.values()];
}

function extractPathParameters(route) {
    const pathPart = route.split("?")[0];
    const withoutMustache = pathPart.replace(/\{\{[^}]+}}/g, "");
    const names = [
        ...[...pathPart.matchAll(/\{\{([^}]+)}}/g)].map((match) => match[1]),
        ...[...withoutMustache.matchAll(/\{([^}:]+)(?::[^}]+)?}/g)].map((match) => match[1]),
        ...[...pathPart.matchAll(/:([A-Za-z_]\w*)/g)].map((match) => match[1]),
    ];
    return [...new Set(names)].map((name) => ({ name, type: "String", required: true, allowedValues: [] }));
}

function defaultParameterValue(parameter, env) {
    if (parameter.name === "companyUniqueName" || /companyname/i.test(parameter.name)) return env.companyUniqueName;
    if (parameter.name === "branchUniqueName") return env.branchUniqueName;
    if (parameter.defaultValue !== null && parameter.defaultValue !== undefined
        && !String(parameter.defaultValue).includes("ValueConstants")) {
        return String(parameter.defaultValue).replace(/^"|"$/g, "");
    }
    if (parameter.allowedValues?.length) return parameter.allowedValues[0];
    if (/boolean|Boolean/.test(parameter.type)) return "false";
    if (/page/i.test(parameter.name)) return "1";
    if (/count|size/i.test(parameter.name)) return "20";
    return "";
}

function applyEnvironmentDefaults() {
    if (!state.selected) return;
    const env = environment();
    for (const name of Object.keys(state.pathValues)) {
        if (name === "companyUniqueName" || /companyname/i.test(name)) state.pathValues[name] = env.companyUniqueName;
        if (name === "branchUniqueName") state.pathValues[name] = env.branchUniqueName;
    }
    if (Object.hasOwn(state.queryValues, "branchUniqueName")) state.queryValues.branchUniqueName = env.branchUniqueName;
    renderParameterGroups();
}

function renderParameterGroups() {
    if (!state.selected) return;
    renderFields(
        elements.pathFields,
        "Path parameters",
        uniqueParameters(state.selected.parameters?.path || [], extractPathParameters(state.selected.path)),
        state.pathValues,
        "path"
    );
    renderFields(elements.queryFields, "Query parameters", state.selected.parameters?.query || [], state.queryValues, "query");
    renderFields(elements.headerFields, "Additional headers", state.selected.parameters?.headers || [], state.customHeaders, "header", true);
}

function renderPartFields() {
    elements.partFields.replaceChildren();
    const parts = state.selected.parameters?.parts || [];
    if (!parts.length) return;
    elements.partFields.append(createTextElement("h4", "Multipart form data"));
    for (const part of parts) {
        const label = document.createElement("label");
        const title = createTextElement("span", part.name);
        const hint = createTextElement("span", ` ${part.type || "String"} · ${part.required ? "required" : "optional"}`);
        hint.className = "field-hint";
        title.append(hint);
        const input = document.createElement("input");
        input.type = /MultipartFile/i.test(part.type || "") ? "file" : "text";
        input.dataset.field = part.name;
        input.addEventListener("change", () => {
            state.partValues[part.name] = input.type === "file" ? input.files?.[0] ?? null : input.value;
            updateCurl();
        });
        label.append(title, input);
        elements.partFields.append(label);
    }
}

function renderFields(container, title, parameters, values, kind, skipEnvironmentHeaders = false) {
    container.replaceChildren();
    const visible = parameters.filter((parameter) => !skipEnvironmentHeaders
        || !["auth-key", "session-id", "origin"].includes(parameter.name.toLowerCase()));
    if (!visible.length) return;
    const heading = createTextElement("h4", title);
    container.append(heading);
    for (const parameter of visible) {
        container.append(createField(parameter, values[parameter.name] ?? "", (value) => {
            values[parameter.name] = value;
            updateRequestPreview();
        }, kind));
    }
}

function appendParameterDescription(label, field) {
    const text = typeof field.description === "string" ? field.description.trim() : "";
    if (!text) return;
    const desc = createTextElement("p", text);
    desc.className = "field-description";
    label.append(desc);
}

function createField(field, value, onChange, kind) {
    const label = document.createElement("label");
    const title = createTextElement("span", field.name);
    const hint = createTextElement(
        "span",
        ` ${field.type || "String"} · ${field.required ? "required" : "optional"}${field.defaultValue !== null && field.defaultValue !== undefined ? ` · default ${field.defaultValue}` : ""}${field.allowedValues?.length ? ` · allowed: ${field.allowedValues.join(", ")}` : ""}`
    );
    hint.className = "field-hint";
    title.append(hint);
    label.append(title);
    appendParameterDescription(label, field);
    let input;
    if (field.allowedValues?.length) {
        input = document.createElement("select");
        if (!field.required) input.append(new Option("— omit —", ""));
        for (const option of field.allowedValues) input.append(new Option(option, option));
        input.value = value;
    } else if (/boolean|Boolean/.test(field.type || "")) {
        input = document.createElement("select");
        if (!field.required) input.append(new Option("— omit —", ""));
        input.append(new Option("true", "true"), new Option("false", "false"));
        input.value = String(value);
    } else {
        input = document.createElement("input");
        input.type = /int|Integer|long|Long|double|Double|float|Float|BigDecimal/.test(field.type || "") ? "number" : "text";
        input.value = value ?? "";
        input.placeholder = kind === "path" ? `Enter ${field.name}` : "Leave blank to omit";
        input.spellcheck = false;
    }
    input.dataset.field = field.name;
    input.addEventListener("input", () => onChange(input.value));
    input.addEventListener("change", () => onChange(input.value));
    label.append(input);
    return label;
}

function renderBodyFields() {
    elements.bodyFields.replaceChildren();
    const requestBody = state.selected.requestBody;
    elements.bodyEditorLabel.hidden = !requestBody;
    if (!requestBody) {
        elements.bodyEditor.value = "";
        elements.bodyError.textContent = "";
        return;
    }
    const fields = requestBody.fields || [];
    if (fields.length) {
        elements.bodyFields.append(createTextElement("h4", "Payload fields"));
        for (const field of fields) {
            const current = state.body?.[field.name];
            if (!Array.isArray(current) && (current === null || typeof current !== "object")) {
                elements.bodyFields.append(createField(field, current ?? "", (value) => {
                    state.body[field.name] = coerceValue(value, field.type);
                    syncBodyEditor();
                }, "body"));
            } else {
                elements.bodyFields.append(createJsonField(field, current));
            }
        }
    }
    syncBodyEditor();
}

function createJsonField(field, current) {
    const label = document.createElement("label");
    const title = createTextElement("span", field.name);
    const hint = createTextElement("span", ` ${field.type} · JSON`);
    hint.className = "field-hint";
    title.append(hint);
    appendParameterDescription(label, field);
    const input = document.createElement("textarea");
    input.rows = 3;
    input.value = JSON.stringify(current ?? [], null, 2);
    input.addEventListener("input", () => {
        try {
            state.body[field.name] = JSON.parse(input.value);
            input.setAttribute("aria-invalid", "false");
            syncBodyEditor();
        } catch {
            input.setAttribute("aria-invalid", "true");
        }
    });
    label.append(title, input);
    return label;
}

function coerceValue(value, type) {
    if (value === "") return null;
    if (/boolean|Boolean/.test(type || "")) return value === "true";
    if (/int|Integer|long|Long|double|Double|float|Float|BigDecimal/.test(type || "")) return Number(value);
    return value;
}

function syncBodyEditor() {
    elements.bodyEditor.value = JSON.stringify(state.body ?? {}, null, 2);
    elements.bodyError.textContent = "";
    updateCurl();
}

function handleBodyEditor() {
    try {
        state.body = elements.bodyEditor.value.trim() ? JSON.parse(elements.bodyEditor.value) : null;
        elements.bodyError.textContent = "";
        elements.bodyEditor.setAttribute("aria-invalid", "false");
        updateCurl();
    } catch (error) {
        elements.bodyError.textContent = `Invalid JSON: ${error.message}`;
        elements.bodyEditor.setAttribute("aria-invalid", "true");
    }
}

function updateRequestPreview() {
    if (!state.selected) return;
    const env = environment();
    let route = state.selected.path.split("?")[0];
    route = route
        .replace(/\{\{([^}]+)}}/g, (_, name) => encodeURIComponent(state.pathValues[name] || placeholderDefault(name, env)))
        .replace(/\{([^}:]+)(?::[^}]+)?}/g, (_, name) => encodeURIComponent(state.pathValues[name] || placeholderDefault(name, env)))
        .replace(/:([A-Za-z_]\w*)/g, (_, name) => encodeURIComponent(state.pathValues[name] || placeholderDefault(name, env)));
    if (!route.startsWith("/")) route = `/${route}`;
    if (route.length > 1) route = route.replace(/\/+$/, "");
    const query = new URLSearchParams();
    for (const [name, value] of Object.entries(state.queryValues)) {
        if (value !== "" && value !== null && value !== undefined) query.set(name, value);
    }
    if (route.includes(`/${encodeURIComponent(env.companyUniqueName)}`) && env.branchUniqueName && !query.has("branchUniqueName")) {
        query.set("branchUniqueName", env.branchUniqueName);
    }
    elements.requestUrl.value = `${env.baseUrl}${route}${query.size ? `?${query}` : ""}`;
    updateCurl();
}

function placeholderDefault(name, env) {
    if (name === "companyUniqueName" || /companyname/i.test(name)) return env.companyUniqueName;
    if (name === "branchUniqueName") return env.branchUniqueName;
    return `SAMPLE_${name}`;
}

function requestHeaders() {
    const env = environment();
    const headers = {
        Accept: state.selected?.produces && /pdf/i.test(state.selected.produces) ? "application/pdf" : "application/json"
    };
    if (env.authKey && env.authKey !== DEFAULT_AUTH_KEY) headers["Auth-Key"] = env.authKey;
    if (env.sessionId && env.sessionId !== DEFAULT_SESSION_ID) headers["Session-Id"] = env.sessionId;
    if (env.origin) headers.Origin = env.origin;
    for (const [name, value] of Object.entries(state.customHeaders)) if (value) headers[name] = value;
    if (state.selected?.requestBody && !hasSelectedParts()) headers["Content-Type"] = "application/json";
    return headers;
}

function hasSelectedParts() {
    return Object.values(state.partValues).some((value) => value !== null && value !== "");
}

function updateCurl() {
    if (!state.selected) return;
    const lines = [
        `curl --request ${state.requestMethod} \\`,
        `  --url ${shellQuote(elements.requestUrl.value)} \\`
    ];
    const headers = Object.entries(requestHeaders());
    headers.forEach(([name, value], index) => {
        const last = index === headers.length - 1 && !state.selected.requestBody && !hasSelectedParts();
        lines.push(`  --header ${shellQuote(`${name}: ${value}`)}${last ? "" : " \\"}`);
    });
    if (hasSelectedParts()) {
        const selectedParts = Object.entries(state.partValues).filter(([, value]) => value !== null && value !== "");
        selectedParts.forEach(([name, value], index) => {
            const fileValue = value instanceof File ? `@/path/to/${value.name}` : String(value);
            lines.push(`  --form ${shellQuote(`${name}=${fileValue}`)}${index === selectedParts.length - 1 ? "" : " \\"}`);
        });
    } else if (state.selected.requestBody) {
        lines.push(`  --data ${shellQuote(JSON.stringify(state.body ?? {}))}`);
    }
    elements.curlPreview.textContent = lines.join("\n");
}

function shellQuote(value) {
    return `'${String(value).replace(/'/g, "'\\''")}'`;
}

async function copyCurl() {
    await navigator.clipboard.writeText(elements.curlPreview.textContent);
    showToast("curl copied.");
}

async function sendRequest() {
    if (!state.selected) return;
    if (elements.bodyError.textContent) {
        elements.bodyEditor.focus();
        return showToast("Fix the JSON body before sending.");
    }
    elements.sendRequest.disabled = true;
    elements.requestStatus.textContent = "Sending…";
    elements.responsePanel.dataset.state = "";
    elements.responsePanel.querySelector("code").textContent = "Waiting for response…";
    try {
        const multipart = hasSelectedParts() ? await serializeParts() : undefined;
        const response = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                method: state.requestMethod,
                url: elements.requestUrl.value,
                headers: requestHeaders(),
                body: !multipart && state.selected.requestBody ? state.body ?? {} : undefined,
                multipart
            })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || `Local proxy failed (${response.status}).`);
        const success = result.status >= 200 && result.status < 400;
        elements.responsePanel.dataset.state = success ? "success" : "error";
        elements.responseMeta.textContent = `${result.status} ${result.statusText} · ${result.durationMs} ms · ${result.contentType}`;
        elements.responsePanel.querySelector("code").textContent = formatResponse(result);
        elements.requestStatus.textContent = success ? "Completed" : "Upstream returned an error";
    } catch (error) {
        elements.responsePanel.dataset.state = "error";
        elements.responsePanel.querySelector("code").textContent = error.message;
        elements.requestStatus.textContent = "Request failed";
    } finally {
        elements.sendRequest.disabled = false;
    }
}

async function serializeParts() {
    const parts = [];
    for (const [name, value] of Object.entries(state.partValues)) {
        if (value instanceof File) {
            parts.push({
                name,
                filename: value.name,
                contentType: value.type || "application/octet-stream",
                base64: await fileToBase64(value)
            });
        } else if (value !== null && value !== "") {
            parts.push({ name, value: String(value) });
        }
    }
    return parts;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(String(reader.result).split(",")[1] || ""));
        reader.addEventListener("error", () => reject(reader.error));
        reader.readAsDataURL(file);
    });
}

function formatResponse(result) {
    if (result.encoding === "base64") return `[Binary ${result.contentType} response encoded as base64]\n\n${result.body}`;
    try {
        return JSON.stringify(JSON.parse(result.body), null, 2);
    } catch {
        return result.body;
    }
}

function exportPostman(records) {
    if (!records.length) return showToast("No APIs selected for export.");
    const env = environment();
    const groups = new Map();
    for (const record of records) {
        const group = record.serviceTitle || record.service;
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group).push(postmanRequest(record));
    }
    const collection = {
        info: {
            _postman_id: crypto.randomUUID(),
            name: `Giddh APIs - ${records.length} endpoints`,
            description: "Generated by Giddh API Explorer from backend-verified controller contracts.",
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        variable: [
            { key: "baseUrl", value: env.baseUrl },
            { key: "companyUniqueName", value: env.companyUniqueName },
            { key: "branchUniqueName", value: env.branchUniqueName },
            { key: "authKey", value: env.authKey, type: "secret" },
            { key: "sessionId", value: env.sessionId, type: "secret" },
            { key: "origin", value: env.origin }
        ],
        item: [...groups].map(([name, item]) => ({ name, item }))
    };
    downloadJson(collection, `giddh-api-collection-${records.length}.postman_collection.json`);
    showToast(`Exported ${records.length} APIs.`);
}

function postmanRequest(record) {
    const method = record.method === "ANY" ? "POST" : record.method;
    let route = record.path
        .replace(/\{\{([^}]+)}}/g, "{{$1}}")
        .replace(/\{([^}:]+)(?::[^}]+)?}/g, "{{$1}}")
        .replace(/:([A-Za-z_]\w*)/g, "{{$1}}");
    route = route.replace(/^\/+/, "");
    const raw = `{{baseUrl}}/${route}`;
    const headers = [
        { key: "Accept", value: /pdf/i.test(record.produces || "") ? "application/pdf" : "application/json" },
        { key: "Auth-Key", value: "{{authKey}}" },
        { key: "Session-Id", value: "{{sessionId}}", disabled: true },
        { key: "Origin", value: "{{origin}}", disabled: true }
    ];
    const parts = record.parameters?.parts || [];
    if (record.requestBody && !parts.length) headers.push({ key: "Content-Type", value: "application/json" });
    const body = parts.length
        ? {
            mode: "formdata",
            formdata: parts.map((part) => /MultipartFile/i.test(part.type || "")
                ? { key: part.name, type: "file", src: "" }
                : { key: part.name, type: "text", value: String(part.defaultValue ?? "") })
        }
        : record.requestBody
            ? { mode: "raw", raw: JSON.stringify(record.requestBody.example ?? {}, null, 2), options: { raw: { language: "json" } } }
            : undefined;
    return {
        name: `${method} ${record.path}`,
        request: {
            method,
            header: headers,
            body,
            url: { raw, host: ["{{baseUrl}}"], path: route.split("?")[0].split("/"), query: postmanQuery(route) },
            description: `${record.description}\n\nSource: ${record.sourceFile}${record.sourceLine ? `:${record.sourceLine}` : ""}`
        }
    };
}

function postmanQuery(route) {
    const query = route.split("?")[1];
    if (!query) return [];
    return query.split("&").filter(Boolean).map((pair) => {
        const [key, value = ""] = pair.split("=");
        return { key, value };
    });
}

function downloadJson(data, filename) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

let toastTimer;
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2400);
}

function createTextElement(tagName, text) {
    const element = document.createElement(tagName);
    element.textContent = text;
    return element;
}
