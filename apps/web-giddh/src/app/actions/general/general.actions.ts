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
import { findIndex, includes } from '../../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * GeneralActions actions
 * Defines general related action creators for state management
 */
export class GeneralActions {

    public GetGroupsWithAccount$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) =>
                this._groupService.getGroupsWithAccounts(action.payload)
            ),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.getGroupWithAccountsResponse(response);
            })));

    public getAllState$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GENERAL_ACTIONS.GENERAL_GET_ALL_STATES),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._companyService.getAllStates(action.payload)),
            /**
             * Handles map functionality
             */
            map(resp => this.getAllStateResponse(resp))));

    public updateIndexDb$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(GENERAL_ACTIONS.UPDATE_INDEX_DB),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                const payload: IUpdateDbRequest = action.payload;
                return this._dbService.getItemDetails(payload?.uniqueName).pipe(map(itemData => ({ itemData, payload })))
            }),
            /**
             * Handles switchMap functionality
             */
            switchMap(data => {
                /**
                 * Handles if functionality
                 */
                if (data.itemData && data.payload) {
                    const payload = data.payload;
                    const items = data.itemData;
                    /**
                     * Handles switch functionality
                     */
                    switch (payload.type) {
                        case "accounts": {
                            const matchedIndex = (items && items.aidata && items.aidata.accounts) ? items.aidata.accounts?.findIndex(item => item && item?.uniqueName && item?.uniqueName === payload.oldUniqueName) : -1;
                            /**
                             * Handles if functionality
                             */
                            if (matchedIndex > -1) {
                                items.aidata.accounts[matchedIndex] = {
                                    ...items.aidata.accounts[matchedIndex],
                                    uniqueName: payload.newUniqueName,
                                    name: payload.name,
                                    route: items.aidata.accounts[matchedIndex]?.route?.replace(payload.oldUniqueName, payload.newUniqueName)
                                }
                                return this._dbService.insertFreshData(items).pipe(map(() => {
                                    /**
                                     * Handles if functionality
                                     */
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
            /**
             * Handles ofType functionality
             */
            ofType(GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                const payload: IUpdateDbRequest = action.payload;
                return this._dbService.removeItem(payload?.uniqueName, payload.type, payload.deleteUniqueName).then(res => {
                    /**
                     * Handles if functionality
                     */
                    if (res && res.aidata && res.aidata.accounts && res.aidata.accounts.length) {
                        /**
                         * Handles if functionality
                         */
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
            /**
             * Handles ofType functionality
             */
            ofType(GENERAL_ACTIONS.GET_SIDE_MENU_ITEMS),
            /**
             * Handles switchMap functionality
             */
            switchMap(() => this._companyService.getMenuItems()),
            /**
             * Handles map functionality
             */
            map(resp => this.saveSideMenuItems(resp?.body))));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions, private _groupService: GroupService, private _companyService: CompanyService, private _dbService: DbService, private route: Router) {

    }

    /**
     * Retrieves groupwithaccounts data
     */
    public getGroupWithAccounts(value?: string): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS,
            payload: value
        };
    }

    /**
     * Retrieves groupwithaccountsresponse data
     */
    public getGroupWithAccountsResponse(value: BaseResponse<GroupsWithAccountsResponse[], string>): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_GROUP_WITH_ACCOUNTS_RESPONSE,
            payload: value
        };
    }

    /**
     * Retrieves allstate data
     */
    public getAllState(value: StatesRequest): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_ALL_STATES,
            payload: value
        };
    }

    /**
     * Retrieves allstateresponse data
     */
    public getAllStateResponse(value: BaseResponse<States, string>): CustomActions {
        return {
            type: GENERAL_ACTIONS.GENERAL_GET_ALL_STATES_RESPONSE,
            payload: value
        };
    }

    /**
     * Handles addAndManageClosed functionality
     */
    public addAndManageClosed(): CustomActions {
        return {
            type: GENERAL_ACTIONS.CLOSE_ADD_AND_MANAGE
        };
    }

    /**
     * Sets sidemenubarstate value
     */
    public setSideMenuBarState(value: boolean): CustomActions {
        return {
            type: GENERAL_ACTIONS.SET_SIDE_MENU_BAR_STATE,
            payload: value
        }
    }

    /**
     * Sets apptitle value
     */
    public setAppTitle(uniqueName: string, additional?: { tab: string, tabIndex: number }) {
        return {
            type: GENERAL_ACTIONS.SET_APP_HEADER_TITLE,
            payload: { uniqueName, additional }
        }
    }

    /**
     * Resets stateslist to default state
     */
    public resetStatesList(): CustomActions {
        return {
            type: GENERAL_ACTIONS.RESET_STATES_LIST
        };
    }

    /**
     * Sets pagetitle value
     */
    public setPageTitle(currentPageObj: CurrentPage) {
        return {
            type: GENERAL_ACTIONS.SET_PAGE_HEADER_TITLE,
            payload: currentPageObj
        }
    }

    /**
     * Updates existing currentliabilities
     */
    public updateCurrentLiabilities(uniqueName: string) {
        return {
            type: GENERAL_ACTIONS.UPDATE_CURRENT_LIABILITIES,
            payload: uniqueName
        }
    }

    /** Update index db action while updating any account
     * it will initiate update index db with new updated account info for accounts in sidebar *
     * **/

    /**
     * Updates existing indexdb
     */
    public updateIndexDb(payload: IUpdateDbRequest): CustomActions {
        return {
            type: GENERAL_ACTIONS.UPDATE_INDEX_DB,
            payload: payload
        }
    }

    /** UpdateIndexDbComplete calls after update index db finished and data has been updated in index db.**/

    /**
     * Updates existing indexdbcomplete
     */
    public updateIndexDbComplete(): CustomActions {
        return {
            type: GENERAL_ACTIONS.UPDATE_INDEX_DB_COMPLETE,
        }
    }

    /** DeleteEntryFromIndexDb action update index db entries after delete any account from application **/
    /**
     * Deletes entryfromindexdb
     */
    public deleteEntryFromIndexDb(request: IUpdateDbRequest): CustomActions {
        return {
            type: GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB,
            payload: request
        }
    }

    /** DeleteEntryFromIndexDbComplete action is for update complete acknowledgement after deleting entry from index db **/
    /**
     * Deletes entryfromindexdbcomplete
     */
    public deleteEntryFromIndexDbComplete(): CustomActions {
        return {
            type: GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB_COMPLETE
        }
    }

    /** DeleteEntryFromIndexDbError action is for handle error acknowledgement for deleting entry from the index db **/
    /**
     * Deletes entryfromindexdberror
     */
    public deleteEntryFromIndexDbError(): CustomActions {
        return {
            type: GENERAL_ACTIONS.DELETE_ENTRY_FROM_INDEX_DB_ERROR
        }
    }

    /** UpdateUIFromDB calls after ui has changed with new data from index db **/
    /**
     * Updates existing uifromdb
     */
    public updateUiFromDb(): CustomActions {
        return {
            type: GENERAL_ACTIONS.UPDATE_UI_FROM_DB
        }
    }
    /* This function is storinng side menu */
    /**
     * Opens sidemenu
     */
    public openSideMenu(isOpen: boolean) {
        return {
            type: GENERAL_ACTIONS.OPEN_SIDE_MENU,
            payload: isOpen
        }
    }

    /**
     * Retrieves sidemenuitems data
     */
    public getSideMenuItems(): CustomActions {
        return {
            type: GENERAL_ACTIONS.GET_SIDE_MENU_ITEMS
        }
    }

    /**
     * Saves sidemenuitems data
     */
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
