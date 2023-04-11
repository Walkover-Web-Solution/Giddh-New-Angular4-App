import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { CurrentPage } from '../../models/api-models/Common';
import { States, StatesRequest } from '../../models/api-models/Company';
import { GroupsWithAccountsResponse } from '../../models/api-models/GroupsWithAccounts';
import { IUpdateDbRequest } from '../../models/interfaces/ulist.interface';
import { CompanyService } from '../../services/company.service';
import { DbService } from '../../services/db.service';
import { GroupService } from '../../services/group.service';
import { CustomActions } from '../../store/custom-actions';
import { GENERAL_ACTIONS } from './general.const';

@Injectable()
export class GeneralActions {

    public GetGroupsWithAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS),
            switchMap((action: CustomActions) =>
                this._groupService.GetGroupsWithAccounts(action.payload)
            ),
            map(response => {
                return this.getGroupWithAccountsResponse(response);
            })));

    public getAllState$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GENERAL_ACTIONS.GENERAL_GET_ALL_STATES),
            switchMap((action: CustomActions) => this._companyService.getAllStates(action.payload)),
            map(resp => this.getAllStateResponse(resp))));

    public updateIndexDb$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GENERAL_ACTIONS.UPDATE_INDEX_DB),
            switchMap((action: CustomActions) => {
                const payload: IUpdateDbRequest = action.payload;
                return this._dbService.getItemDetails(payload?.uniqueName).pipe(map(itemData => ({ itemData, payload })))
            }),
            switchMap(data => {
                if (data.itemData && data.payload) {
                    const payload = data.payload;
                    const items = data.itemData;
                    switch (payload.type) {
                        case "accounts": {
                            const matchedIndex = (items && items.aidata && items.aidata.accounts) ? items.aidata.accounts?.findIndex(item => item && item?.uniqueName && item?.uniqueName === payload.oldUniqueName) : -1;
                            if (matchedIndex > -1) {
                                items.aidata.accounts[matchedIndex] = {
                                    ...items.aidata.accounts[matchedIndex],
                                    uniqueName: payload.newUniqueName,
                                    name: payload.name,
                                    route: items.aidata.accounts[matchedIndex]?.route?.replace(payload.oldUniqueName, payload.newUniqueName)
                                }
                                return this._dbService.insertFreshData(items).pipe(map(() => {
                                    if (this.route.url.includes('/ledger/' + payload.oldUniqueName)) {
                                        this.route.navigate(['pages', 'ledger', payload.newUniqueName]);
                                    }
                                    return this.updateIndexDbComplete();
                                }));
                            } else {
                                return of(this.updateIndexDbComplete());
                            }
                        }
                        default: {
                            return of(this.updateIndexDbComplete());
                        }
                    }
                } else {
                    return of(this.updateIndexDbComplete());
                }
            })
        ));

    public deleteIndexDbEntry$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB),
            switchMap((action: CustomActions) => {
                const payload: IUpdateDbRequest = action.payload;
                return this._dbService.removeItem(payload?.uniqueName, payload.type, payload.deleteUniqueName).then(res => {
                    if (res && res.aidata && res.aidata.accounts && res.aidata.accounts.length) {
                        if (this.route.url.includes('/ledger/' + payload.deleteUniqueName)) {
                            this.route.navigate(['pages', 'ledger', res.aidata.accounts[0]?.uniqueName]);
                        }
                        return this.deleteEntryFromIndexDbComplete();
                    }
                    return this.deleteEntryFromIndexDbError();
                }).catch(error => this.deleteEntryFromIndexDbError());
            })
        ));

    public getSideMenuItems$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(GENERAL_ACTIONS.GET_SIDE_MENU_ITEMS),
            switchMap(() => this._companyService.getMenuItems()),
            map(resp => this.saveSideMenuItems(resp?.body))));

    constructor(private action$: Actions, private _groupService: GroupService, private _companyService: CompanyService, private _dbService: DbService, private route: Router) {

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

    public setSideMenuBarState(value: boolean): CustomActions {
        return {
            type: GENERAL_ACTIONS.SET_SIDE_MENU_BAR_STATE,
            payload: value
        }
    }

    public setAppTitle(uniqueName: string, additional?: { tab: string, tabIndex: number }) {
        return {
            type: GENERAL_ACTIONS.SET_APP_HEADER_TITLE,
            payload: { uniqueName, additional }
        }
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
    /* This function is storinng side menu */
    public openSideMenu(isOpen: boolean) {
        return {
            type: GENERAL_ACTIONS.OPEN_SIDE_MENU,
            payload: isOpen
        }
    }

    public getSideMenuItems(): CustomActions {
        return {
            type: GENERAL_ACTIONS.GET_SIDE_MENU_ITEMS
        }
    }

    public saveSideMenuItems(items: Array<any>): CustomActions {
        return {
            type: GENERAL_ACTIONS.SAVE_SIDE_MENU_ITEMS,
            payload: items
        }
    }
    /**
     * Returns the action to open the GST side menu
     *
     * @params {boolean} shouldOpen True, if GST menu needs to be opened
     * @return {*} {CustomActions} Action to open GST side menu
     * @memberof GeneralActions
     */
     public openGstSideMenu(shouldOpen: boolean): CustomActions {
        return {
            type: GENERAL_ACTIONS.OPEN_GST_SIDE_MENU,
            payload: shouldOpen
        }
    }

    /**
     * Hide/Show calendly model
     *
     * @param {boolean} isOpen
     * @returns
     * @memberof GeneralActions
     */
    public isOpenCalendlyModel(isOpen: boolean) {
        return {
            type: GENERAL_ACTIONS.OPEN_CALENDLY_MODEL,
            payload: isOpen
        }
    }
}
