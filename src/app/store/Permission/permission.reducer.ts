import { Action } from '@ngrx/store';
import { PermissionRequest, PermissionResponse } from '../../models/api-models/Permission';
import { PermissionActions } from '../../services/actions/permission.actions';
// import { PermissionActions } from '../../services/actions/permission.actions';
import * as _ from 'lodash';

export interface PermissionState {
    // value?: AccountFlat[];
    // value?: object;
    // searchLoader: boolean;
    // search: boolean;
    // searchDataSet: SearchDataSet[];
    // searchRequest: SearchRequest;
}

export const initialState: PermissionState = {
    // value: [],
    // searchLoader: false,
    // search: false,
    // searchRequest: null,
    // searchDataSet: [{
    //     queryType: '',
    //     balType: 'CREDIT',
    //     queryDiffer: '',
    //     amount: '',
    // }]
};

export function PermissionReducer(state = initialState, action: Action): PermissionState {
    switch (action.type) {

        case PermissionActions.PERMISSION_RESPONSE: {
            return Object.assign({}, state, {
                value: action.payload,
                // searchLoader: false,
                // search: true
            });
        }
        case PermissionActions.PERMISSION_REQUEST: {
            return Object.assign({}, state, {
                // searchLoader: true,
                permissionRequest: action.payload
            });
        }

        default: {
            return state;
        }
    }
}

// const flattenSearchGroupsAndAccounts = (rawList: PermissionResponse[]) => {
//     let listofUN;
//     listofUN = rawList.map((obj) => {
//         // let uniqueList: AccountFlat[] = [];
//         if (!_.isNull(obj)) {
//             return flattenSearchGroupsAndAccounts(obj as PermissionResponse[]) as AccountFlat[];
//         } else {
//             _.each(obj, (account) => {
//                 // let accountFlat: AccountFlat = {
//                 //     parent: obj.groupName,
//                 //     closeBalType: account.closingBalance.type,
//                 //     closingBalance: account.closingBalance.amount,
//                 //     openBalType: account.openingBalance.type,
//                 //     creditTotal: account.creditTotal,
//                 //     debitTotal: account.debitTotal,
//                 //     openingBalance: account.openingBalance,
//                 //     uniqueName: obj.uniqueName,
//                 //     name: obj.groupName
//                 // };
//                 // uniqueList.push(accountFlat);
//                 return account;
//             });
//             return obj;
//         }
//     });
//     return _.flatten(listofUN);
// };
