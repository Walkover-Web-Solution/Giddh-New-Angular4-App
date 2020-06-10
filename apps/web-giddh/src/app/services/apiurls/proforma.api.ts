const baseUrlV2 = 'v3/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/';
const baseUrl = 'company/:companyUniqueName/vouchers/v3/:vouchers/';

export const PROFORMA_API = {
    generate: `${baseUrlV2}generate`,
    getAll: `${baseUrl}all?`,
    base: `${baseUrlV2}`,
    download: `${baseUrlV2}download?fileType=:fileType`,
    generateInvoice: `company/:companyUniqueName/vouchers/accounts/:accountUniqueName/generate-via-proforma`,
    updateAction: `${baseUrlV2}action`,
    generateEstimate: `${baseUrlV2}generate/estimate`,
    mailProforma: `${baseUrlV2}mail`
};

export const ESTIMATES_API = {
    generate: `${baseUrlV2}generate`,
    getAll: `${baseUrl}all?`,
    base: `${baseUrlV2}`,
    download: `${baseUrlV2}download?fileType=:fileType`,
    generateInvoice: `company/:companyUniqueName/vouchers/accounts/:accountUniqueName/generate-via-estimate`,
    generateProforma: `${baseUrlV2}generate-via-estimate`,
    updateAction: `${baseUrlV2}action`,
    getVersions: `${baseUrlV2}versions/all?`,
    getVersion: `${baseUrlV2}versions`
};
