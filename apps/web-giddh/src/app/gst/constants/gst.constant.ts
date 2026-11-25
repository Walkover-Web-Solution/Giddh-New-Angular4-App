/** Enum of all the supported GST reports */
export enum GstReport {
    Gstr1 = 'gstr1',
    Gstr2 = 'gstr2',
    Gstr3b = 'gstr3b',
    Ims = 'ims'
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

/**
 * IMS sections that carry ITC fields (itcRedReq, remarks) on Accept.
 * B2B has none. B2BCN is the credit-note code seen in the recorded sandbox save.
 */
export const IMS_ITC_SECTIONS: readonly string[] = ['B2BA', 'DNA', 'CN', 'CNA', 'ECOMA', 'B2BCN'];

/** Portal status codes that mean a save is still being processed */
export const IMS_IN_PROGRESS_STATUS_CODES: readonly string[] = ['IP'];

/** Portal status codes that mean a save was processed successfully */
export const IMS_SUCCESS_STATUS_CODES: readonly string[] = ['P', 'REC', '1'];
