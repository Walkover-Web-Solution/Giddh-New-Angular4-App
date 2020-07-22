import {map, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {GroupService} from '../../services/group.service';
import {BaseResponse} from '../../models/api-models/BaseResponse';
import {Action} from '@ngrx/store';
import {GroupsWithAccountsResponse} from '../../models/api-models/GroupsWithAccounts';
import {GENERAL_ACTIONS} from './general.const';
import {Observable, of} from 'rxjs';
import {FlattenAccountsResponse} from '../../models/api-models/Account';
import {AccountService} from '../../services/account.service';
import {States, StatesRequest} from '../../models/api-models/Company';
import {CompanyService} from '../../services/companyService.service';
import {CustomActions} from '../../store/customActions';
import {IPaginatedResponse} from '../../models/interfaces/paginatedResponse.interface';
import {IUlist, IUpdateDbRequest } from '../../models/interfaces/ulist.interface';
import {CurrentPage} from '../../models/api-models/Common';
import {DbService} from "../../services/db.service";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable()
export class GeneralActions {
    @Effect()
    public GetGroupsWithAccount$: Observable<Action> = this.action$
        .ofType(GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.GetGroupsWithAccounts(action.payload)
            ),
            map(response => {
                return this.getGroupWithAccountsResponse(response);
            }));

    @Effect()
    public GetFlattenGroups$: Observable<Action> = this.action$
        .ofType(GENERAL_ACTIONS.FLATTEN_GROUPS_REQ).pipe(
            switchMap((action: CustomActions) =>
                this._groupService.GetFlattenGroups(action.payload)
            ),
            map(response => {
                return this.getFlattenGroupsRes(response);
            }));

    @Effect()
    public getFlattenAccounts$: Observable<Action> = this.action$
        .ofType(GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS).pipe(
            switchMap((action: CustomActions) =>
                this._accountService.getFlattenAccounts(action.payload)
            ),
            map(response => {
                return this.getFlattenAccountResponse(response);
            }));

    @Effect()
    public getAllState$: Observable<Action> = this.action$
        .ofType(GENERAL_ACTIONS.GENERAL_GET_ALL_STATES).pipe(
            switchMap((action: CustomActions) => this._companyService.getAllStates(action.payload)),
            map(resp => this.getAllStateResponse(resp)));

    @Effect()
    public updateIndexDb$: Observable<Action> = this.action$
        .ofType(GENERAL_ACTIONS.UPDATE_INDEX_DB).pipe(
            switchMap((action: CustomActions) => {
                const payload: IUpdateDbRequest = action.payload;
                return this._dbService.getItemDetails(payload.uniqueName).pipe(map(itemData => ({itemData, payload})))
            }),
            switchMap(data => {
                // debugger;
                if (data.itemData && data.payload) {
                    const payload = data.payload;
                    const items = data.itemData;
                    switch (payload.type) {
                        case "accounts": {
                            const matchedIndex = items.aidata.accounts.findIndex(item => item && item.uniqueName && item.uniqueName === payload.oldUniqueName);
                            if (matchedIndex > -1) {
                                items.aidata.accounts[matchedIndex] = {
                                    ...items.aidata.accounts[matchedIndex],
                                    uniqueName: payload.newUniqueName,
                                    name: payload.name,
                                    route: items.aidata.accounts[matchedIndex].route.replace(payload.oldUniqueName, payload.newUniqueName)
                                }
                                return this._dbService.insertFreshData(items).pipe(map(() => {
                                    if (this.route.url.includes('/ledger/' + payload.oldUniqueName)) {
                                        this.route.navigate(['pages', 'ledger', payload.newUniqueName]);
                                    }
                                    return this.updateIndexDbComplete()
                                }));
                            } else {
                                return of(this.updateIndexDbComplete());
                            }
                        }
                        default : {
                            return of(this.updateIndexDbComplete())
                        }
                    }
                } else {
                    return of(this.updateIndexDbComplete());
                }
            })
        );

    @Effect()
    deleteIndexDbEntry$: Observable<Action> = this.action$
        .ofType(GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB).pipe(
            switchMap((action: CustomActions) => {
                const payload: IUpdateDbRequest = action.payload;
                return this._dbService.removeItem(payload.uniqueName, payload.type, payload.deleteUniqueName).then(res => {
                    if (res) {
                        if (this.route.url.includes('/ledger/' + payload.deleteUniqueName)) {
                            this.route.navigate(['pages', 'ledger', res.aidata.accounts[0].uniqueName]);
                        }
                        return this.deleteEntryFromIndexDbComplete()
                    }
                    return this.deleteEntryFromIndexDbError();
                }).
                catch(error => this.deleteEntryFromIndexDbError());
            })
        )

    constructor(private action$: Actions, private _groupService: GroupService, private _accountService: AccountService, private _companyService: CompanyService, private _dbService: DbService, private _activatedRoute: ActivatedRoute, private route: Router) {
        //
    }

    public getGroupWithAccounts(value?: string): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS,
            payload: value
        };
    }

    public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE,
            payload: value
        };
    }

    public getFlattenAccount(value?: string): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS,
            payload: value
        };
    }

    public getFlattenAccountResponse(value: BaseResponse<FlattenAccountsResponse, string>): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_FLATTEN_ACCOUNTS_RESPONSE,
            payload: value
        };
    }

    public getAllState(value: StatesRequest): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_ALL_STATES,
            payload: value
        };
    }

    public getAllStateResponse(value: BaseResponse<States, string>): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_ALL_STATES_RESPONSE,
            payload: value
        };
    }

    public addAndManageClosed(): CustomActions {
        return {
            type: GENERAL_ACTIONS.CLOSE_ADD_AND_MANAGE
        };
    }

    public getFlattenGroupsReq(value?: any): CustomActions {
        return {
            type: GENERAL_ACTIONS.FLATTEN_GROUPS_REQ,
            payload: value
        };
    }

    public getFlattenGroupsRes(model: BaseResponse<IPaginatedResponse, any>): CustomActions {
        return {
            type: GENERAL_ACTIONS.FLATTEN_GROUPS_RES,
            payload: model
        };
    }

    public setCombinedList(model: IUlist[]): CustomActions {
        return {
            type: GENERAL_ACTIONS.SET_COMBINED_LIST,
            payload: model
        };
    }

    public resetCombinedList(): CustomActions {
        return {
            type: GENERAL_ACTIONS.RESET_COMBINED_LIST
        };
    }

    public setSmartList(model: IUlist[]): CustomActions {
        return {
            type: GENERAL_ACTIONS.SET_SMART_LIST,
            payload: model
        };
    }

    public setSideMenuBarState(value: boolean): CustomActions {
        return {
            type: GENERAL_ACTIONS.SET_SIDE_MENU_BAR_STATE,
            payload: value
        }
    }

    public setAppTitle(uniqueName: string, additional?: { tab: string, tabIndex: number }) {
        return {
            type: GENERAL_ACTIONS.SET_APP_HEADER_TITLE,
            payload: {uniqueName, additional}
        }
    }

    public resetSmartList(): CustomActions {
        return {
            type: GENERAL_ACTIONS.RESET_SMART_LIST
        };
    }

    public resetStatesList(): CustomActions {
        return {
            type: GENERAL_ACTIONS.RESET_STATES_LIST
        };
    }

    public setPageTitle(currentPageObj: CurrentPage) {
        return {
            type: GENERAL_ACTIONS.SET_PAGE_HEADER_TITLE,
            payload: currentPageObj
        }
    }

    public isOpenCalendlyModel(isOpen: boolean) {
        return {
            type: GENERAL_ACTIONS.OPEN_CALENDLY_MODEL,
            payload: isOpen
        }
    }

    public updateCurrentLiabilities(uniqueName: string) {
        return {
            type: GENERAL_ACTIONS.UPDATE_CURRENT_LIABILITIES,
            payload: uniqueName
        }
    }

    /** Update index db action while updating any account
     * it will initiate update index db with new updated account info for accounts in sidebar *
     * **/

    public updateIndexDb(payload: IUpdateDbRequest): CustomActions {
        return {
            type: GENERAL_ACTIONS.UPDATE_INDEX_DB,
            payload: payload
        }
    }

    /** UpdateIndexDbComplete calls after update index db finished and data has been updated in index db.**/

    public updateIndexDbComplete(): CustomActions {
        return {
            type: GENERAL_ACTIONS.UPDATE_INDEX_DB_COMPLETE,
        }
    }

    /** DeleteEntryFromIndexDb action update index db entries after delete any account from application **/
    public deleteEntryFromIndexDb(request: IUpdateDbRequest): CustomActions {
        return {
            type: GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB,
            payload: request
        }
    }

    /** DeleteEntryFromIndexDbComplete action is for update complete acknowledgement after deleting entry from index db **/
    public deleteEntryFromIndexDbComplete(): CustomActions {
        return {
            type: GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB_COMPLETE
        }
    }

    /** DeleteEntryFromIndexDbError action is for handle error acknowledgement for deleting entry from the index db **/
    public deleteEntryFromIndexDbError(): CustomActions {
        return {
            type: GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB_ERROR
        }
    }

    /** UpdateUIFromDB calls after ui has changed with new data from index db **/
    public updateUiFromDb(): CustomActions {
        return {
            type: GENERAL_ACTIONS.UPDATE_UI_FROM_DB
        }
    }
}
