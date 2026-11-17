/** Enter and Backspace key codes. Froala's global KEYCODE map is absent when the editor bundle loads as a module. */
export const EDITOR_ENTER_KEY = 13;
export const EDITOR_BACKSPACE_KEY = 8;

export interface EditorHtmlApi {
    get: (cleanMarkers?: boolean, skipClassInlining?: boolean) => string;
    set: (html: string) => void;
    __giddhGuarded?: boolean;
}

/**
 * Froala's no-arg html.get() copies every stylesheet on the page into the live editor, then serializes it.
 * That rewrite runs on each keystroke. Passing true as the second argument skips it.
 * Explicit callers (markdown preview passes false) keep their own choice.
 */
export function guardEditorHtmlApi(htmlApi: EditorHtmlApi, shouldIgnoreSet: () => boolean): void {
    if (htmlApi.__giddhGuarded) {
        return;
    }
    const originalGet = htmlApi.get.bind(htmlApi);
    const originalSet = htmlApi.set.bind(htmlApi);
    htmlApi.get = (cleanMarkers?: boolean, skipClassInlining?: boolean) =>
        originalGet(cleanMarkers, skipClassInlining ?? true);
    htmlApi.set = (html: string) => {
        if (shouldIgnoreSet()) {
            return;
        }
        originalSet(html);
    };
    htmlApi.__giddhGuarded = true;
}

/** Tribute owns Enter and Backspace while its menu is open. Froala must not handle those keys too. */
export function tributeHandlesEditorKey(keyCode: number, tributeActive: boolean): boolean {
    return tributeActive && (keyCode === EDITOR_ENTER_KEY || keyCode === EDITOR_BACKSPACE_KEY);
}

const PASTED_META_PARAGRAPH = /<p>\s*<meta\b[^>]*\bid=(["'])isPasted\1[^>]*>\s*<\/p>/gi;
const META_TAG = /<meta\b[^>]*>/gi;
const PASTE_MARKER_ID = /\sid=(["'])isPasted\1/gi;

/**
 * Drop the paste marker Froala leaves on copied email HTML.
 * A node with id="isPasted" loses its inline styles when the editor splits or merges a block, which is what Backspace does.
 */
export function normalizeEmailTemplateHtml(html: string): string {
    return html.replace(PASTED_META_PARAGRAPH, '').replace(META_TAG, '').replace(PASTE_MARKER_ID, '');
}
