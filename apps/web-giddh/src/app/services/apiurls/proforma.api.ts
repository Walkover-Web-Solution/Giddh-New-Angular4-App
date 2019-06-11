const baseUrlV2 = 'v2/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/';
const baseUrl = 'company/:companyUniqueName/vouchers/:vouchers/';


export const PROFORMA_API = {
  generate: `${baseUrlV2}generate`,
  getAll: `${baseUrl}all?`,
  base: `${baseUrlV2}`,
  download: `${baseUrlV2}download?fileType=:fileType`,
  generateInvoice: `${baseUrlV2}vouchers/generate`,
  updateAction: `${baseUrlV2}action`,
  generateEstimate: `${baseUrlV2}generate/estimate`,
  mailProforma: `${baseUrlV2}mail`
};

export const ESTIMATES_API = {
  generate: `${baseUrlV2}generate`,
  getAll: `${baseUrl}all?`,
  base: `${baseUrlV2}`,
  download: `${baseUrlV2}download?fileType=:fileType`,
  generateInvoice: `${baseUrlV2}generate`,
  updateAction: `${baseUrlV2}action`,
  getVersion: `${baseUrlV2}versions/`
};
