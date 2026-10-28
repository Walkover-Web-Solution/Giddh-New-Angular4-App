// A/B experiments through the middleware. Never awaits the network: the page never waits for it.
// Experiments are defined and started by the owner in the middleware; see docs/EXPERIMENTS.md.
const MW_EVENTS = 'https://cursor-slack-bot.embarko.app/repos/giddh-panel-angular/events';
const MW_KEY = 'pk_139844e870310e463bbafd87148482c5'; // publishable: it can only append events

/** Variants exactly as defined on the middleware, in order, e.g. [['control', 50], ['b', 50]] */
export type MwVariants = ReadonlyArray<readonly [string, number]>;

export interface MwEvent {
    event: 'exposure' | 'conversion';
    experiment: string;
    variant: string;
    goal?: string;
}

let mwId: string | null | undefined;
let mwOff = false;

function mwVisitor(): string {
    if (mwId) return mwId;
    try { mwId = localStorage.getItem('mw_visitor'); } catch { }
    if (!mwId) {
        const bytes = new Uint8Array(16);
        try { crypto.getRandomValues(bytes); } catch { for (let i = 0; i < 16; i++) bytes[i] = Math.random() * 256; }
        mwId = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
        try { localStorage.setItem('mw_visitor', mwId); } catch { }
    }
    return mwId;
}

function mwBucket(experiment: string, visitorId: string, variants: MwVariants): string | undefined {
    let h = 0x811c9dc5;
    const s = `${experiment}:${visitorId}`;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h = (h ^ (h >>> 16)) >>> 0;
    let n = h % variants.reduce((sum, [, w]) => sum + w, 0);
    for (const [key, w] of variants) if ((n -= w) < 0) return key;
}

/**
 * The variant to render, at once and locally. On any error: the control (the first), or undefined if there is none.
 */
export function mwVariant(experiment: string, variants: MwVariants): string | undefined {
    try { return mwBucket(experiment, mwVisitor(), variants) ?? variants[0][0]; } catch { return variants?.[0]?.[0]; }
}

/**
 * Fire and forget: returns nothing, never throws, never waits. Do not await it or chain on it.
 */
export function mwSend(event: MwEvent): void {
    if (mwOff) return;
    try {
        const body = JSON.stringify({ key: MW_KEY, visitor_id: mwVisitor(), ...event });
        if (navigator.sendBeacon?.(MW_EVENTS, body)) return;
        const signal = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined;
        fetch(MW_EVENTS, { method: 'POST', body, keepalive: true, credentials: 'omit', signal }).catch(() => { mwOff = true; });
    } catch { mwOff = true; }
}
