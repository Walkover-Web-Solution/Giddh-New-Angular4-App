const baseUrl = 'company/:companyUniqueName/vouchers/v3/:vouchers/';
const baseUrlV2 = 'v2/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/';
const baseUrlV3 = 'v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/';

export const PROFORMA_API = {
    generate: `${baseUrlV3}generate`,
    getAll: `${baseUrl}all?`,
    base: `${baseUrlV3}`,
    download: `${baseUrlV3}download?fileType=:fileType`,
    generateInvoice: `company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-proforma`,
    updateAction: `${baseUrlV3}action`,
    generateEstimate: `${baseUrlV3}generate/estimate`,
    mailProforma: `${baseUrlV3}mail`
};

export const ESTIMATES_API = {
    generate: `${baseUrlV3}generate`,
    getAll: `${baseUrl}all?`,
    base: `${baseUrlV3}`,
    download: `${baseUrlV3}download?fileType=:fileType`,
    generateInvoice: `company/:companyUniqueName/vouchers/accounts/:accountUniqueName/v3/generate-via-estimate`,
    generateProforma: `v3/company/:companyUniqueName/accounts/:accountUniqueName/proformas/generate-via-estimate`,
    updateAction: `${baseUrlV3}action`,
    getVersions: `${baseUrlV2}versions/all?`,
    getVersion: `${baseUrlV2}versions`
};
