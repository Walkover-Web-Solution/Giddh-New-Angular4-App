const baseUrl = 'v2/company/:companyUniqueName/accounts/:accountUniqueName/:vouchers/';

export const PROFORMA_API = {
  generate: `${baseUrl}generate`,
  getAll: `${baseUrl}all?page=:page&count=:count`,
  base: `${baseUrl}`,
  download: `${baseUrl}download?fileType=:fileType`,
  generateInvoice: `${baseUrl}vouchers/generate`,
  updateAction: `${baseUrl}action`,
  generateEstimate: `${baseUrl}generate/estimate`
};

export const ESTIMATES_API = {
  generate: `${baseUrl}generate`,
  getAll: `${baseUrl}all?page=:page&count=:count`,
  base: `${baseUrl}`,
  download: `${baseUrl}download?fileType=:fileType`,
  generateInvoice: `${baseUrl}generate`,
  updateAction: `${baseUrl}action`,
  getVersion: `${baseUrl}versions/`
};
