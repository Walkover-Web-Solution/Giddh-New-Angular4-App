/** Enum of all the supported GST reports */
/**
 * GstReport enumeration
 * Defines constant values for GstReport
 */
export enum GstReport {
    Gstr1 = 'gstr1',
    Gstr2 = 'gstr2',
    Gstr3b = 'gstr3b'
}

/** Enum for tax service */
/**
 * TaxServiceEnum enumeration
 * Defines constant values for TaxServiceEnum
 */
export enum TaxServiceEnum {
    TAXPRO = 'TAXPRO',
    RECONCILE = 'RECONCILE',
    JIO_GST = 'JIO_GST',
    VAYANA = 'VAYANA'
}

/** Type for tax service */
/**
 * TaxServiceType interface definition
 * Defines the structure and contract for TaxServiceType objects
 */
export type TaxServiceType = 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';