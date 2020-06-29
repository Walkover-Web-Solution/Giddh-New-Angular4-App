import { SETTINGS_PERMISSION_ACTIONS } from '../../actions/settings/permissions/settings.permissions.const';
import { LinkedAccountsState, SettingsState } from './Settings.reducer';
import * as _ from '../../lodash-optimized';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from '../../actions/settings/settings.integration.const';
import { SETTINGS_PROFILE_ACTIONS } from '../../actions/settings/profile/settings.profile.const';
import { ActiveFinancialYear, CompanyResponse } from '../../models/api-models/Company';
import { EmailKeyClass, IntegrationPage, IntegrationPageClass, PaymentClass, RazorPayClass, RazorPayDetailsResponse, SmsKeyClass } from '../../models/api-models/SettingsIntegraion';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { SETTINGS_LINKED_ACCOUNTS_ACTIONS } from '../../actions/settings/linked-accounts/settings.linked.accounts.const';
import { SETTINGS_FINANCIAL_YEAR_ACTIONS } from '../../actions/settings/financial-year/financial-year.const';
import { IFinancialYearResponse, ILockFinancialYearRequest } from '../../services/settings.financial-year.service';
import { CustomActions } from '../customActions';
import { SETTINGS_BRANCH_ACTIONS } from '../../actions/settings/branch/settings.branch.const';
import { SETTINGS_TAG_ACTIONS } from '../../actions/settings/tag/settings.tag.const';
import { SETTINGS_TRIGGERS_ACTIONS } from '../../actions/settings/triggers/settings.triggers.const';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { SETTINGS_DISCOUNT_ACTIONS } from '../../actions/settings/discount/settings.discount.const';
import { AccountResponse } from '../../models/api-models/Account';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { SETTINGS_TAXES_ACTIONS } from "../../actions/settings/taxes/settings.taxes.const";

export interface LinkedAccountsState {
    bankAccounts?: BankAccountsResponse[];
    isBankAccountsInProcess?: boolean;
    isDeleteBankAccountIsInProcess?: boolean;
    needReloadingLinkedAccounts?: boolean;
    iframeSource?: string;
}

export interface DiscountState {
    isDiscountListInProcess: boolean;
    discountList: IDiscountList[];
    isDiscountCreateInProcess: boolean;
    isDiscountCreateSuccess: boolean;
    isDiscountUpdateInProcess: boolean;
    isDiscountUpdateSuccess: boolean;
    isDeleteDiscountInProcess: boolean;
    isDeleteDiscountSuccess: boolean;
}

const discountInitialState: DiscountState = {
    discountList: [],
    isDeleteDiscountInProcess: false,
    isDeleteDiscountSuccess: false,
    isDiscountCreateInProcess: false,
    isDiscountCreateSuccess: false,
    isDiscountListInProcess: false,
    isDiscountUpdateInProcess: false,
    isDiscountUpdateSuccess: false
};

export interface AmazonState {
    isSellerSuccess: boolean;
    isSellerUpdated: boolean;
}

const AmazonInititalState: AmazonState = {
    isSellerSuccess: false,
    isSellerUpdated: false
};

export interface Taxes {
    taxes: [{
        label: string;
        value: string;
        types: [{
            label: string;
            value: string;
        }]
        countries: [];
    }]
}

const taxesInitialState: Taxes = {
    taxes: [{
        label: '',
        value: '',
        types: [{
            label: '',
            value: ''
        }],
        countries: []
    }]
};

export interface SettingsState {
    integration: IntegrationPage;
    profile: any;
    inventory: any;
    updateProfileSuccess: boolean;
    updateProfileInProgress: boolean;
    getProfileInProgress: boolean
    linkedAccounts: LinkedAccountsState;
    financialYears: IFinancialYearResponse;
    usersWithCompanyPermissions: any;
    branches: any;
    tags: any;
    parentCompany: CompanyResponse;
    triggers: any;
    discount: DiscountState;
    refreshCompany: boolean;
    amazonState: AmazonState;
    isGmailIntegrated: boolean;
    profileRequest: boolean;
    isPaymentAdditionSuccess: boolean;
    isPaymentUpdationSuccess: boolean;
    taxes: Taxes;
    branchRemoved: boolean;
}

export const initialState: SettingsState = {
    integration: new IntegrationPageClass(),
    profile: {},
    inventory: {},
    profileRequest: false,
    updateProfileSuccess: false,
    updateProfileInProgress: false,
    linkedAccounts: {},
    financialYears: null,
    usersWithCompanyPermissions: null,
    branches: null,
    tags: null,
    parentCompany: null,
    triggers: null,
    discount: discountInitialState,
    refreshCompany: false,
    amazonState: AmazonInititalState,
    isGmailIntegrated: false,
    isPaymentAdditionSuccess: false,
    isPaymentUpdationSuccess: false,
    taxes: null,
    branchRemoved: false,
    // Get profile API call in process
    getProfileInProgress: false
};

export function SettingsReducer(state = initialState, action: CustomActions): SettingsState {
    let newState = _.cloneDeep(state);
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR_PERIOD: {
            return Object.assign({}, state, { refreshCompany: false });
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.UPDATE_FINANCIAL_YEAR_PERIOD_RESPONSE: {
            return Object.assign({}, state, { refreshCompany: true });
        }
        case SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE:
            let gtsmsres: BaseResponse<SmsKeyClass, string> = action.payload;
            if (gtsmsres.status === 'success') {
                newState.integration.smsForm = gtsmsres.body;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE:
            let crtsmsres: BaseResponse<string, SmsKeyClass> = action.payload;
            if (crtsmsres.status === 'success') {
                newState.integration.smsForm = crtsmsres.request;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE:
            let gtemlres: BaseResponse<EmailKeyClass, string> = action.payload;
            if (gtemlres.status === 'success') {
                newState.integration.emailForm = gtemlres.body;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE:
            let crtemlres: BaseResponse<string, EmailKeyClass> = action.payload;
            if (crtemlres.status === 'success') {
                newState.integration.emailForm = crtemlres.request;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.CREATE_PAYMENT_KEY_RESPONSE:
            let crtpytres: BaseResponse<string, PaymentClass> = action.payload;
            if (crtpytres.status === 'success') {
                newState.integration.paymentForm = crtpytres.request;
                newState.isPaymentAdditionSuccess = true;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_KEY_RESPONSE:
            let crtpytUpres: BaseResponse<string, PaymentClass> = action.payload;
            if (crtpytUpres.status === 'success') {
                //newState.integration.paymentForm = crtpytUpres.request;
                newState.isPaymentUpdationSuccess = true;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE:
            let getRzrPayRes: BaseResponse<RazorPayDetailsResponse, string> = action.payload;
            if (getRzrPayRes.status === 'success') {
                newState.integration.razorPayForm = getRzrPayRes.body;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE:
        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE:
            let svRzrPayRes: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = action.payload;
            if (svRzrPayRes.status === 'success') {
                newState.integration.razorPayForm = svRzrPayRes.body;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE:
            let dltRzrPayRes: BaseResponse<string, string> = action.payload;
            if (dltRzrPayRes.status === 'success') {
                newState.integration.razorPayForm = null;
                return Object.assign({}, state, newState);
            }
            return state;

        // region profile

       case SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO: {
            return Object.assign({}, state, { getProfileInProgress: true });
       }

        case SETTINGS_PROFILE_ACTIONS.GET_PROFILE_RESPONSE: {
            let response: BaseResponse<CompanyResponse, string> = action.payload;
            if (response.status === 'success') {
                newState.profile = response.body;
                newState.profileRequest = true;
                newState.getProfileInProgress = false;
                return Object.assign({}, state, newState);
            }
            return { ...state, updateProfileInProgress: true, getProfileInProgress: false };
        }
        case SETTINGS_PROFILE_ACTIONS.UPDATE_PROFILE_RESPONSE: {
            let response: BaseResponse<CompanyResponse, string> = action.payload;
            if (response.status === 'success') {
                newState.profile = _.cloneDeep(response.body);
                newState.updateProfileSuccess = true;
                newState.profileRequest = true;
                return Object.assign({}, state, newState);
            }
            return Object.assign({}, state, {
                updateProfileSuccess: false,
                profileRequest: true
            });
        }
        case SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE: {
            return {
                ...state,
                updateProfileSuccess: false,
                updateProfileInProgress: true,
                profileRequest: false
            };
            // newState.updateProfileSuccess = false;
            // newState.updateProfileInProgress = true;
            // newState.profileRequest = false;
            // return Object.assign({}, state, newState);
        }
        case SETTINGS_PROFILE_ACTIONS.RESET_PATCH_PROFILE: {
            return {
                ...state,
                updateProfileSuccess: false,
            };
        }
        case SETTINGS_PROFILE_ACTIONS.PATCH_PROFILE_RESPONSE: {
            let response: BaseResponse<CompanyResponse, string> = action.payload;
            if (response.status === 'success') {
                return {
                    ...state,
                    profile: _.cloneDeep(response.body),
                    updateProfileSuccess: true,
                    updateProfileInProgress: false,
                    profileRequest: true
                };
                // newState.profile = _.cloneDeep(response.body);
                // newState.updateProfileSuccess = true;
                // newState.updateProfileInProgress = false;
                // newState.profileRequest = true;
                // return Object.assign({}, state, newState);
            }
            return Object.assign({}, state, {
                updateProfileSuccess: false,
                updateProfileInProgress: false,
                profileRequest: true
            });
        }
        case SETTINGS_PROFILE_ACTIONS.GET_INVENTORY_RESPONSE: {
            let response: BaseResponse<CompanyResponse, string> = action.payload;
            if (response.status === 'success') {
                newState.inventory = response.body;
                newState.profileRequest = true;
                return Object.assign({}, state, newState);
            }
            return { ...state, updateProfileInProgress: true };
        }
        case SETTINGS_PROFILE_ACTIONS.UPDATE_INVENTORY_RESPONSE: {
            let response: BaseResponse<CompanyResponse, string> = action.payload;
            if (response.status === 'success') {
                // newState.profile = _.cloneDeep(response.body);
                newState.updateProfileSuccess = true;
                newState.profileRequest = true;
                return Object.assign({}, state, newState);
            }
            return Object.assign({}, state, {
                updateProfileSuccess: true,
                profileRequest: true
            });
        }
        // endregion
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS: {
            newState.linkedAccounts.isBankAccountsInProcess = true;
            return Object.assign({}, state, newState);
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.GET_ALL_ACCOUNTS_RESPONSE: {
            let response: BaseResponse<BankAccountsResponse[], string> = action.payload;
            if (response.status === 'success') {
                newState.linkedAccounts.isBankAccountsInProcess = false;
                newState.linkedAccounts.bankAccounts = _.orderBy(response.body, ['siteName'], ['asc']);
            } else {
                newState.linkedAccounts.isBankAccountsInProcess = false;
            }
            return Object.assign({}, state, newState);
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_ALL_ACCOUNTS_RESPONSE: {
            let response: BaseResponse<LinkedAccountsState[], string> = action.payload;
            if (response.status === 'success') {
                newState.linkedAccounts = response.body as LinkedAccountsState;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.REFRESH_BANK_ACCOUNT_RESPONSE: {
            newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
            return Object.assign({}, state, newState);
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT: {
            newState.linkedAccounts.isDeleteBankAccountIsInProcess = true;
            return Object.assign({}, state, newState);
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.DELETE_BANK_ACCOUNT_RESPONSE: {
            let response: BaseResponse<string, string> = action.payload;
            if (response.status === 'success') {
                _.map(newState.linkedAccounts.bankAccounts, (ac) => {
                    _.filter(ac.accounts, (account) => account.loginId !== response.request);
                });
                // newState.linkedAccounts.needReloadingLinkedAccounts = true;
            } else {
                newState.linkedAccounts.isDeleteBankAccountIsInProcess = false;
                // newState.linkedAccounts.needReloadingLinkedAccounts = false;
            }
            newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
            return Object.assign({}, state, newState);
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.GET_ALL_FINANCIAL_YEARS_RESPONSE: {
            let response: BaseResponse<IFinancialYearResponse, string> = action.payload;
            if (response.status === 'success') {
                newState.financialYears = response.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.LOCK_FINANCIAL_YEAR_RESPONSE: {
            let response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = action.payload;
            if (response.status === 'success') {
                newState.financialYears = null;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.UNLOCK_FINANCIAL_YEAR_RESPONSE: {
            let response: BaseResponse<IFinancialYearResponse, ILockFinancialYearRequest> = action.payload;
            if (response.status === 'success') {
                newState.financialYears = null;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.SWITCH_FINANCIAL_YEAR_RESPONSE: {
            let response: BaseResponse<ActiveFinancialYear, string> = action.payload;
            if (response.status === 'success') {
                newState.financialYears = null;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR_RESPONSE: {
            let response: BaseResponse<IFinancialYearResponse, string> = action.payload;
            if (response.status === 'success') {
                newState.financialYears = null;
                newState.refreshCompany = true;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FINANCIAL_YEAR: {
            return Object.assign({}, state, { refreshCompany: false });
        }
        case SETTINGS_FINANCIAL_YEAR_ACTIONS.ADD_FUTURE_FINANCIAL_YEAR: {
            return Object.assign({}, state, { refreshCompany: false });
        }
        case SETTINGS_PERMISSION_ACTIONS.GET_USERS_WITH_COMPANY_PERMISSIONS_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response.status === 'success') {
                newState.financialYears = null;
                newState.usersWithCompanyPermissions = response.body;
            }
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.RECONNECT_ACCOUNT_RESPONSE: {
            let response: BaseResponse<any, string> = action.payload;
            if (response.status === 'success') {
                newState.linkedAccounts.iframeSource = response.body.connectUrl;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.LINK_BANK_ACCOUNT_RESPONSE: {
            newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
            return Object.assign({}, state, newState);
        }
        case SETTINGS_LINKED_ACCOUNTS_ACTIONS.UNLINK_BANK_ACCOUNT_RESPONSE: {
            newState.linkedAccounts.needReloadingLinkedAccounts = !newState.linkedAccounts.needReloadingLinkedAccounts;
            return Object.assign({}, state, newState);
        }
        case SETTINGS_BRANCH_ACTIONS.GET_ALL_BRANCHES_RESPONSE: {
            let response: BaseResponse<any, any> = action.payload;
            if (response.status === 'success') {
                newState.branches = response.body;
                return Object.assign({}, state, newState);
            }
            return Object.assign({}, state, newState);
        }
        case SETTINGS_BRANCH_ACTIONS.GET_PARENT_COMPANY_RESPONSE: {
            let response: BaseResponse<any, any> = action.payload;
            if (response.status === 'success') {
                newState.parentCompany = response.body;
            } else {
                newState.parentCompany = null;
            }
            return Object.assign({}, state, newState);
        }
        case SETTINGS_TAG_ACTIONS.GET_ALL_TAGS_RESPONSE: {
            let response: BaseResponse<any, any> = action.payload;
            return {
                ...state,
                tags: response.status === 'success' ? response.body : null
            };
        }
        case SETTINGS_TRIGGERS_ACTIONS.GET_TRIGGERS_RESPONSE: {
            let response: BaseResponse<any, any> = action.payload;
            if (response.status === 'success') {
                newState.triggers = response.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_INTEGRATION_ACTIONS.GET_CASHFREE_DETAILS_RESPONSE:
            let cashFreeRes: BaseResponse<any, any> = action.payload;
            if (cashFreeRes.status === 'success') {
                newState.integration.payoutForm = cashFreeRes.body;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.SAVE_CASHFREE_DETAILS_RESPONSE:
        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE:
            let savecashFreeRes: BaseResponse<any, any> = action.payload;
            if (savecashFreeRes.status === 'success') {
                newState.integration.payoutForm = savecashFreeRes.request;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.DELETE_CASHFREE_DETAILS_RESPONSE:
            let dltCashFreeRes: BaseResponse<string, string> = action.payload;
            if (dltCashFreeRes.status === 'success') {
                newState.integration.payoutForm = {};
                return Object.assign({}, state, newState);
            }
            return state;

        case SETTINGS_INTEGRATION_ACTIONS.GET_AUTOCOLLECT_USER_RESPONSE:
            let autoCollectRes: BaseResponse<any, any> = action.payload;
            if (autoCollectRes.status === 'success') {
                newState.integration.autoCollect = autoCollectRes.body;
                return Object.assign({}, state, newState);
            }
            return state;

        case SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE:
        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE:
            let saveautoCollectRes: BaseResponse<any, any> = action.payload;
            if (saveautoCollectRes.status === 'success') {
                newState.integration.autoCollect = saveautoCollectRes.request;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.DELETE_AUTOCOLLECT_USER_RESPONSE:
            let dltautoCollectRes: BaseResponse<string, string> = action.payload;
            if (dltautoCollectRes.status === 'success') {
                newState.integration.autoCollect = {};
                return Object.assign({}, state, newState);
            }
            return state;

        case SETTINGS_INTEGRATION_ACTIONS.GET_PAYMENT_GATEWAY_RESPONSE:
            let paymentGatewayRes: BaseResponse<any, any> = action.payload;
            if (paymentGatewayRes.status === 'success') {
                newState.integration.paymentGateway = paymentGatewayRes.body;
                return Object.assign({}, state, newState);
            }
            return state;

        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_PAYMENT_GATEWAY_RESPONSE:
            let paymntGtwy: BaseResponse<any, any> = action.payload;
            if (paymntGtwy.status === 'success') {
                newState.integration.paymentGateway = paymntGtwy.request;
                return Object.assign({}, state, newState);
            }
            return state;
        case SETTINGS_INTEGRATION_ACTIONS.DELETE_PAYMENT_GATEWAY_RESPONSE:
            let dltpaymentGatewayRes: BaseResponse<string, string> = action.payload;
            if (dltpaymentGatewayRes.status === 'success') {
                newState.integration.paymentGateway = {};
                return Object.assign({}, state, newState);
            }
            return state;

        //  region discount reducer
        case SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT: {
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, { isDiscountListInProcess: true })
            });
        }
        case SETTINGS_DISCOUNT_ACTIONS.GET_DISCOUNT_RESPONSE: {
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDiscountListInProcess: false,
                    discountList: action.payload
                })
            });
        }

        case SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT: {
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDiscountCreateInProcess: true,
                    isDiscountCreateSuccess: false
                })
            });
        }
        case SETTINGS_DISCOUNT_ACTIONS.CREATE_DISCOUNT_RESPONSE: {
            let response: BaseResponse<AccountResponse, CreateDiscountRequest> = action.payload;

            if (response.status === 'error') {
                return Object.assign({}, state, {
                    discount: Object.assign({}, state.discount, {
                        isDiscountCreateInProcess: false,
                        isDiscountCreateSuccess: false,
                    })
                });
            }

            let discountList = _.cloneDeep(state.discount.discountList);
            discountList.push(response.body);
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDiscountCreateInProcess: false,
                    isDiscountCreateSuccess: true,
                    discountList
                })
            });
        }

        case SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT: {
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDiscountUpdateInProcess: true,
                    isDiscountUpdateSuccess: false
                })
            });
        }
        case SETTINGS_DISCOUNT_ACTIONS.UPDATE_DISCOUNT_RESPONSE: {
            let response: BaseResponse<AccountResponse, CreateDiscountRequest> = action.payload;

            if (response.status === 'error') {
                return Object.assign({}, state, {
                    discount: Object.assign({}, state.discount, {
                        isDiscountUpdateInProcess: false,
                        isDiscountUpdateSuccess: false,
                    })
                });
            }

            let discountList = _.cloneDeep(state.discount.discountList);
            discountList = discountList.map(dis => {
                if (dis.uniqueName === response.queryString) {
                    dis = response.body;
                }
                return dis;
            });
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDiscountUpdateInProcess: false,
                    isDiscountUpdateSuccess: true,
                    discountList
                })
            });
        }

        case SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT: {
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDeleteDiscountInProcess: true,
                    isDeleteDiscountSuccess: false
                })
            });
        }
        case SETTINGS_DISCOUNT_ACTIONS.DELETE_DISCOUNT_RESPONSE: {
            return Object.assign({}, state, {
                discount: Object.assign({}, state.discount, {
                    isDeleteDiscountInProcess: false,
                    isDeleteDiscountSuccess: true,
                    discountList: state.discount.discountList.filter(d => d.uniqueName !== action.payload)
                })
            });
        }
        case SETTINGS_INTEGRATION_ACTIONS.GET_AMAZON_SELLER_RESPONSE: {
            let AmazonSellerRes: BaseResponse<any, any> = action.payload;
            if (AmazonSellerRes.status === 'success') {
                newState.integration.amazonSeller = AmazonSellerRes.body;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER: {
            return Object.assign({}, state, {
                amazonState: {
                    isSellerSuccess: false,
                }
            });
        }
        case SETTINGS_INTEGRATION_ACTIONS.ADD_AMAZON_SELLER_RESPONSE: {
            let AmazonSellerRes: BaseResponse<any, any> = action.payload;
            if (AmazonSellerRes.status === 'success') {
                newState.amazonState.isSellerSuccess = true;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER: {
            return Object.assign({}, state, {
                amazonState: {
                    isSellerUpdated: false,
                }
            });
        }

        case SETTINGS_INTEGRATION_ACTIONS.UPDATE_AMAZON_SELLER_RESPONSE: {
            let AmazonSellerRes: BaseResponse<any, any> = action.payload;
            if (AmazonSellerRes.status === 'success') {
                // debugger;
                let seller = state.integration.amazonSeller.findIndex(p => p.sellerId === AmazonSellerRes.body.sellerId);
                newState.integration.amazonSeller[seller] = _.cloneDeep(AmazonSellerRes.body);
                newState.amazonState.isSellerUpdated = true;
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_INTEGRATION_ACTIONS.DELETE_AMAZON_SELLER_RESPONSE: {
            let deleteAmazonSellerRes: BaseResponse<any, any> = action.payload;
            if (deleteAmazonSellerRes.status === 'success') {
                let st = newState.integration.amazonSeller.findIndex(p => p.sellerId === deleteAmazonSellerRes.request.sellerId);
                newState.integration.amazonSeller.splice(st, 1);
                return Object.assign({}, state, newState);
            }
            return state;
        }
        case SETTINGS_INTEGRATION_ACTIONS.GET_GMAIL_INTEGRATION_STATUS_RESPONSE: {
            let response: BaseResponse<any, any> = action.payload;
            if (response && response.body) {
                return Object.assign({}, state, { isGmailIntegrated: true });
            } else {
                return Object.assign({}, state, { isGmailIntegrated: false });
            }
        }

        case SETTINGS_INTEGRATION_ACTIONS.REMOVE_GMAIL_INTEGRATION_RESPONSE: {
            let response: BaseResponse<any, any> = action.payload;
            if (response.status === 'success') {
                return Object.assign({}, state, { isGmailIntegrated: false });
            } else {
                return Object.assign({}, state, { isGmailIntegrated: true });
            }
        }
        case SETTINGS_INTEGRATION_ACTIONS.RESET_PAYMENT_STATUS_RESPONSE: {
            newState.isPaymentAdditionSuccess = false;
            newState.isPaymentUpdationSuccess = false;
            return Object.assign({}, state, newState);
        }

        case SETTINGS_TAXES_ACTIONS.GET_TAX_RESPONSE:
            let taxes: BaseResponse<any, string> = action.payload;
            if (taxes.status === 'success') {
                return Object.assign({}, state, {
                    taxes: taxes.body
                });
            }
            return Object.assign({}, state, {});

        case SETTINGS_TAXES_ACTIONS.RESET_TAX_RESPONSE: {
            return { ...state, taxes: null };
        }

        case SETTINGS_BRANCH_ACTIONS.REMOVED_BRANCH_RESPONSE: {
            return Object.assign({}, state, { branchRemoved: true });
        }

        case SETTINGS_BRANCH_ACTIONS.RESET_REMOVED_BRANCH_RESPONSE: {
            return Object.assign({}, state, { branchRemoved: false });
        }

        //  endregion discount reducer
        default: {
            return state;
        }
    }
}
