export const COMMON_API = {
    COUNTRY: 'country?formName=:formName&refresh=false',
    TAXES: 'ui/taxes?country=:country',
    CURRENCY: 'currency',
    CALLING_CODES: 'ui/calling-code',
    FORM: 'ui/forms?formName=:formName&country=:country&refresh=false',
    PARTY_TYPE: 'ui/party-types',
    COMMAND_K: 'company/:companyUniqueName/cmdk?page=:page&q=:q&group=:group&refresh=false&isMobile=:isMobile',
    DOWNLOAD_FILE: 'company/:companyUniqueName/download-file?voucherVersion=2&fileType=:fileType&downloadOption=:downloadOption',
    STOCK_UNITS: 'stock-units'
};
