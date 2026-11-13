/** Sentinel written by multi-select-dropdown when the All option is selected. */
export const SELECTED_ALL_OPTION = 'SELECTED_ALL_OPTION';

export function isSelectedAllOption(selected: unknown): boolean {
    return Array.isArray(selected) && selected.length === 1 && selected[0] === SELECTED_ALL_OPTION;
}

/**
 * Mutates a request for the API: selected-all arrays become empty arrays and
 * their leaf field names are recorded at the root. Array contents are not visited.
 */
export function normalizeSelectedAllRequest<T>(node: T): T {
    if (!node || typeof node !== 'object') {
        return node;
    }

    const selectAllFields: string[] = [];
    replaceSelectedAllFields(node, selectAllFields);
    (node as Record<string, unknown>).selectAllFields = selectAllFields;
    return node;
}

function replaceSelectedAllFields(node: unknown, selectAllFields: string[]): void {
    if (!node || typeof node !== 'object' || Array.isArray(node)) {
        return;
    }

    const requestNode = node as Record<string, unknown>;
    Object.keys(requestNode).forEach(key => {
        const value = requestNode[key];
        if (isSelectedAllOption(value)) {
            requestNode[key] = [];
            selectAllFields.push(key);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            replaceSelectedAllFields(value, selectAllFields);
        }
    });
}
