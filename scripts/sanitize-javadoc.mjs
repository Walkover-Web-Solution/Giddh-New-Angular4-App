/** Strip JavaDoc {@link …}, HTML, and "API :" prefixes for human-readable API text. */

export function humanizeIdentifier(value) {
    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/^./, (char) => char.toUpperCase())
        .replace(/\s+/g, " ")
        .trim();
}

export function humanizeConstantName(name) {
    return String(name)
        .replace(/_API$/i, "")
        .toLowerCase()
        .split("_")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function expandJavaDocLink(inner) {
    let text = inner.trim();
    const hashIdx = text.indexOf("#");
    if (hashIdx !== -1) {
        const member = text.slice(hashIdx + 1).replace(/\s.*$/, "");
        return humanizeConstantName(member);
    }
    const withoutParens = text.replace(/\([^)]*\)/g, "").trim();
    const tokens = withoutParens.split(/\s+/).filter(Boolean);
    if (tokens.length >= 2 && /^[a-z]/.test(tokens[tokens.length - 1])) {
        return humanizeIdentifier(tokens[tokens.length - 1]);
    }
    const simple = tokens.at(-1) || text;
    return humanizeIdentifier(simple.split(".").pop());
}

export function sanitizeJavaDocText(text) {
    if (!text || typeof text !== "string") return text;
    let cleaned = text.replace(/\{@link\s+([^}]+)\}/g, (_, inner) => expandJavaDocLink(inner));
    cleaned = cleaned.replace(/<[^>]+>/g, " ");
    cleaned = cleaned.replace(/\s+/g, " ").trim();
    cleaned = cleaned.replace(/^API\s*:\s*/i, "").trim();
    cleaned = cleaned.replace(/^Use\s+/i, "").trim();
    if (/^[A-Z0-9 ]{8,}$/.test(cleaned)) {
        cleaned = cleaned
            .split(/\s+/)
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ");
    }
    return cleaned || text;
}
