/** Enum of all the supported GST reports */
export enum GstReport {
    Gstr1 = 'gstr1',
    Gstr2 = 'gstr2',
    Gstr3b = 'gstr3b'
}

/** Enum for tax service */
export enum TaxServiceEnum {
    TAXPRO = 'TAXPRO',
    RECONCILE = 'RECONCILE',
    JIO_GST = 'JIO_GST',
    VAYANA = 'VAYANA'
}

/** Type for tax service */
export type TaxServiceType = 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';