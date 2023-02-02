import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../customActions';
import { SubscriptionsActions } from '../../actions/userSubscriptions/subscriptions.action';
import { SubscriptionsUser } from '../../models/api-models/Subscriptions';

export interface SubscriptionState {
    subscriptions: SubscriptionsUser[];
    companies: any;
    transactions: any;
    companyTransactions: any;
}

const initialState = {
    subscriptions: [],
    companies: null,
    transactions: null,
    companyTransactions: null
};

export function SubscriptionReducer(state: SubscriptionState = initialState, action: CustomActions): SubscriptionState {
    switch (action.type) {
        case SubscriptionsActions.SubscribedCompaniesResponse: {
            let data: BaseResponse<any, string> = action.payload;
            if (data?.status === 'success') {
                return { ...state, subscriptions: data.body };
            }
            return state;
        }
        case SubscriptionsActions.SubscribedUserTransactionsResponse: {
            let data: BaseResponse<any, string> = action.payload;
            if (data?.status === 'success') {
                return { ...state, transactions: data.body };
            }
            return state;
        }
        case SubscriptionsActions.SubscribedCompanyTransactionsResponse: {
            let data: BaseResponse<any, string> = action.payload;
            if (data?.status === 'success') {
                return { ...state, companyTransactions: data.body };
            }
            return state;
        }
        case SubscriptionsActions.SubscribedCompaniesListResponse: {
            let data: BaseResponse<any, string> = action.payload;
            if (data?.status === 'success') {
                return { ...state, companies: data.body };
            }
            return state;
        }
        default:
            return state;
    }
}
