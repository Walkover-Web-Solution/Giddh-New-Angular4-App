export const VAT_API = {
	VIEW_REPORT: 'v2/company/:companyUniqueName/vat-report?from=:from&to=:to&taxNumber=:taxNumber',
    DOWNLOAD_REPORT: 'v2/company/:companyUniqueName/vat-report-download?from=:from&to=:to&taxNumber=:taxNumber&fileType=base64',
    VIEW_TRANSACTIONS_REPORT: 'v2/company/:companyUniqueName/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&page=:page&count=:count',
};
