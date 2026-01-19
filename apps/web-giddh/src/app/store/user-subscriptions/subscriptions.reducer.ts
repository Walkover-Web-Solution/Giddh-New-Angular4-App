import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CustomActions } from '../custom-actions';
import { SubscriptionsActions } from '../../actions/user-subscriptions/subscriptions.action';
import { SubscriptionsUser } from '../../models/api-models/Subscriptions';

/**
 * SubscriptionState interface definition
 * Defines the structure and contract for SubscriptionState objects
 */
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
    /**
     * Handles switch functionality
     */
    switch (action.type) {
        case SubscriptionsActions.SubscribedCompaniesResponse: {
            let data: BaseResponse<any, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                return { ...state, subscriptions: data.body };
            }
            return state;
        }
        case SubscriptionsActions.SubscribedUserTransactionsResponse: {
            let data: BaseResponse<any, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                return { ...state, transactions: data.body };
            }
            return state;
        }
        case SubscriptionsActions.SubscribedCompanyTransactionsResponse: {
            let data: BaseResponse<any, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                return { ...state, companyTransactions: data.body };
            }
            return state;
        }
        case SubscriptionsActions.SubscribedCompaniesListResponse: {
            let data: BaseResponse<any, string> = action.payload;
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                return { ...state, companies: data.body };
            }
            return state;
        }
        default:
            return state;
    }
}
