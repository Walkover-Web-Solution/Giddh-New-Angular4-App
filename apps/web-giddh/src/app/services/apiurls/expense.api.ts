const UNIVERSAL_URI_EXPENSE = 'company/:companyUniqueName/pettycash-manager/';
export const EXPENSE_API = {
    // get call
    GET: UNIVERSAL_URI_EXPENSE + 'report',
    ACTION: UNIVERSAL_URI_EXPENSE + ':uniqueName?action=:actionType&accountUniqueName=:accountUniqueName',
    GETEntry: UNIVERSAL_URI_EXPENSE + 'ledger/:accountUniqueName',
};
