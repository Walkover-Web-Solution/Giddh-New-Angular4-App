/**
 * Markup that must not be stored in an accounting description.
 * Tags and script URLs are rejected. A comparison such as "5 < 10" is not.
 */
const HTML_OR_SCRIPT_PATTERN = /<\s*\/?\s*script\b|<\s*\/?\s*[a-z][^>]*>|javascript\s*:/i;

export function containsHtmlOrScript(value: unknown): boolean {
    return typeof value === 'string' && HTML_OR_SCRIPT_PATTERN.test(value);
}
