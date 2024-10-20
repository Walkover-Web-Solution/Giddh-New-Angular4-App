export const VAT_API = {
    VIEW_REPORT: 'company/:companyUniqueName/uk/vat-report?from=:from&to=:to&taxNumber=:taxNumber',
    VIEW_REPORT_V2: 'v2/company/:companyUniqueName/vat-report?from=:from&to=:to&taxNumber=:taxNumber',
    VIEW_ZW_REPORT: 'company/:companyUniqueName/zw/vat-report?from=:from&to=:to&taxNumber=:taxNumber&currencyCode=:currencyCode',
    VIEW_KENYA_REPORT: 'company/:companyUniqueName/kenya/vat-report?from=:from&to=:to&taxNumber=:taxNumber',
    DOWNLOAD_REPORT: 'v2/company/:companyUniqueName/vat-report-download?from=:from&to=:to&taxNumber=:taxNumber&fileType=base64',
    DOWNLOAD_ZW_REPORT: 'company/:companyUniqueName/zw/vat-report-download?from=:from&to=:to&taxNumber=:taxNumber&currencyCode=:currencyCode&fileType=base64',
    DOWNLOAD_KENYA_REPORT: 'company/:companyUniqueName/kenya/vat-report-download?from=:from&to=:to&taxNumber=:taxNumber&fileType=base64',
    VIEW_TRANSACTIONS_REPORT: 'v2/company/:companyUniqueName/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&page=:page&count=:count',
    VIEW_ZW_TRANSACTIONS_REPORT: 'company/:companyUniqueName/zw/vat-report-detailed?from=:from&to=:to&taxNumber=:taxNumber&section=:section&currencyCode=:currencyCode&page=:page&count=:count',
    DOWNLOAD_ZW_TRANSACTIONS_REPORT: 'company/:companyUniqueName/zw/vat-report-detailed-download?from=:from&to=:to&taxNumber=:taxNumber&section=:section&currencyCode=:currencyCode&page=:page&count=:count',
    CHECK_HMRC_AUTHORIZATION: 'company/:companyUniqueName/authorize',
    SAVE_AUTHORIZATION_CODE: 'company/:companyUniqueName/save-authorization-code',
    VAT_OBLIGATIONS: 'company/:companyUniqueName/uk/vat-obligations?branchUniqueName=:branchUniqueName&taxNumber=:taxNumber&status=:status&from=:from&to=:to',
    VIEW_VAT_RETURN: 'company/:companyUniqueName/uk/view-vat-return?taxNumber=:taxNumber&periodKey=:periodKey&from=:from&to=:to',
    SUBMIT_VAT_RETURN: 'company/:companyUniqueName/uk/submit-vat-return?taxNumber=:taxNumber&periodKey=:periodKey&from=:from&to=:to&branchUniqueName=:branchUniqueName',
    PAYMENTS: 'company/:companyUniqueName/uk/retrieve-vat-payments?taxNumber=:taxNumber&from=:from&to=:to&branchUniqueName=:branchUniqueName',
    LIABILITIES:'company/:companyUniqueName/uk/retrieve-vat-liabilities?taxNumber=:taxNumber&from=:from&to=:to&branchUniqueName=:branchUniqueName'
};
