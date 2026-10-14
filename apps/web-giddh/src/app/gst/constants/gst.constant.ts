/** Enum of all the supported GST reports */
export enum GstReport {
    Gstr1 = 'gstr1',
    Gstr2 = 'gstr2',
    Gstr3b = 'gstr3b'
}

/** Enum for tax service */
export enum TaxServiceEnum {
    RECONCILE = 'RECONCILE',
    JIO_GST = 'JIO_GST',
    WHITEBOOKS = 'WHITEBOOKS'
}

/**
 * Active GSP provider for GST filing / OTP session.
 * Change this single value to switch the provider everywhere it is used.
 */
export const ACTIVE_GSP_PROVIDER = TaxServiceEnum.WHITEBOOKS;

/** Lowercase session flag key matching API/store shape for ACTIVE_GSP_PROVIDER. */
export const ACTIVE_GSP_SESSION_KEY = ACTIVE_GSP_PROVIDER.toLowerCase();

/** Empty GSP session response for the active provider. */
export function createEmptyGspSessionResponse(): Record<string, boolean> {
    return { [ACTIVE_GSP_SESSION_KEY]: false };
}

/** Whether the active GSP has an authenticated session. */
export function isActiveGspAuthenticated(session: Record<string, boolean> | null | undefined): boolean {
    return !!session?.[ACTIVE_GSP_SESSION_KEY];
}

/** Builds session response flags from the gsp query value used during OTP verify. */
export function buildGspSessionResponse(gsp: string): Record<string, boolean> {
    return { [ACTIVE_GSP_SESSION_KEY]: gsp === ACTIVE_GSP_PROVIDER };
}

/** Type for tax service */
export type TaxServiceType = `${TaxServiceEnum}`;
