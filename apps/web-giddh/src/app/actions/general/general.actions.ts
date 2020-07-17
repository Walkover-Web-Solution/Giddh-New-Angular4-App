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
import {IUlist, UpdateDbRequest} from '../../models/interfaces/ulist.interface';
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
                const payload: UpdateDbRequest = action.payload;
                return this._dbService.getItemDetails(payload.uniqueName).pipe(map(itemData => ({itemData, payload})))
            }),
            switchMap(data => {
                // debugger;
                if (data.itemData && data.payload) {
                    const payload = data.payload;
                    const items = data.itemData;
                    switch (payload.type) {
                        case "accounts": {
                            // debugger;
                            const matchedIndex = items.aidata.accounts.findIndex(item => item && item.uniqueName && item.uniqueName === payload.oldUniqueName);
                            if (matchedIndex > -1) {
                                items.aidata.accounts = items.aidata.accounts.map(item => {

                                    if (item && item.uniqueName && item.uniqueName === payload.oldUniqueName) {

                                        return {
                                            ...item,
                                            uniqueName: payload.newUniqueName,
                                            name: payload.name,
                                            route: item.route.replace(payload.oldUniqueName, payload.newUniqueName)
                                        }
                                    }
                                    return item
                                });
                                this._dbService.insertFreshData(items).subscribe(() => {
                                    if (this._activatedRoute.children.length) {
                                        debugger;
                                        let child = this._activatedRoute.children[0]
                                        if (child.children.length) {
                                            let child2 = child.children[0];
                                            let path: string = child.snapshot.url[0].path;
                                            if (child2.children.length && path === 'pages') {
                                                let child3 = child2.children[0];
                                                let path1: string = child2.snapshot.url[0].path;
                                                if (child3.snapshot.url.length && path1 === 'ledger') {
                                                    if (child3.snapshot.url[0].path === payload.oldUniqueName) {
                                                       this.route.navigate(['pages', 'ledger', payload.newUniqueName]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    return of(this.updateIndexDbComplete())
                                });
                            } else {
                                return of(this.updateIndexDbComplete());
                            }
                        }
                    }
                } else {
                    return of(this.updateIndexDbComplete());
                }
            })
        )

    constructor(private action$: Actions, private _groupService: GroupService, private _accountService: AccountService, private _companyService: CompanyService, private _dbService: DbService,private _activatedRoute: ActivatedRoute, private route: Router) {
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

    public updateIndexDb(payload: UpdateDbRequest) {
        return {
            type: GENERAL_ACTIONS.UPDATE_INDEX_DB,
            payload: payload
        }
    }

    public updateIndexDbComplete() {
        return {
            type: GENERAL_ACTIONS.UPDATE_INDEX_DB_COMPLETE,
        }
    }
    public updateUiFromDb() {
        return {
            type: GENERAL_ACTIONS.UPDATE_UI_FROM_DB
        }
    }
}
