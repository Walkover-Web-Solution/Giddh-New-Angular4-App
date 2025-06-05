export const CONTACT_API = {
    ADD_COMMENT: 'v2/company/:companyUniqueName/accounts/:accountUniqueName/report-comment',
    SEND_EMAIL_TEMPLATE: 'v2/company/:companyUniqueName/accounts/send-mail',
    BANKACCOUNTS_REFRESH: 'company/:companyUniqueName/gocardless/refresh?accountUniqueName=:accountUniqueName',
    GOCARDLESS_BANK_TRANSACTIONS_REFRESH: 'company/:companyUniqueName/gocardless/refresh?accountUniqueName=:accountUniqueName'
};

export const ACCOUNT_STATEMENT_API = {
    GET: 'company/:companyUniqueName/accounts/:accountUniqueName/ledgers-v2/view-statement?count=:count&lang=en&from=:from&to=:to&sort=:sort&page=:page&q=:q'
}






