import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { GroupsWithStocksFlatten, GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StockDetailResponse, StockGroupResponse } from '../../models/api-models/Inventory';
import { InventoryActionsConst } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/custom-actions';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * SidebarAction actions
 * Defines sidebaraction related action creators for state management
 */
export class SidebarAction {

    public GetInventoryGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetInventoryGroup),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetGroupsStock(action.payload?.groupUniqueName).pipe(shareReplay(), map(response => {
                    /**
                     * Handles if functionality
                     */
                    if (response?.status === 'error') {
                        this._toasty.errorToast(response.message, response.code);
                    } else {
                        this.store.dispatch(this.GetInventoryGroupResponse(response));
                    }
                    return { type: 'EmptyAction' };
                }));
            })));

    public GetInventoryStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetInventoryStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetStockDetails(action.payload.activeGroupUniqueName, action.payload.stockUniqueName);
            }),
            /**
             * Handles map functionality
             */
            map(response => {
                /**
                 * Handles if functionality
                 */
                if (response) {
                    return this.GetInventoryStockResponse(response);
                } else {
                    this._toasty.errorToast('Stock Not Found');
                    return { type: 'EmptyAction' };
                }
            })));

    public GetInventoryStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetInventoryStockResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public GetGroupUniqueName$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetGroupUniqueName),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsStock(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetGroupUniqueNameResponse(response);
            })));

    public GetGroupUniqueNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetGroupUniqueNameResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public GetGroupsWithStocksHierarchyMin$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMin),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsWithStocksHierarchyMin(action.payload?.q, action.payload?.page, action.payload?.count)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetGroupsWithStocksHierarchyMinResponse(response);
            })));

    public GetGroupsWithStocksHierarchyMinResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public SearchGroupsWithStocks$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.SearchGroupsWithStocks),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.SearchStockGroupsWithStocks(action.payload?.q, action.payload?.page, action.payload?.count)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.SearchGroupsWithStocksResponse(response);
            })));

    public SearchGroupsWithStocksResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.SearchGroupsWithStocksResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                /**
                 * Handles if functionality
                 */
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _inventoryService: InventoryService
    ) {
    }

    /**
     * Handles OpenGroup functionality
     */
    public OpenGroup(groupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.InventoryGroupToggleOpen,
            payload: groupUniqueName
        };
    }

    /**
     * Handles GetInventoryGroup functionality
     */
    public GetInventoryGroup(groupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryGroup,
            payload: { groupUniqueName }
        };
    }

    /**
     * Handles GetInventoryGroupResponse functionality
     */
    public GetInventoryGroupResponse(value: BaseResponse<StockGroupResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryGroupResponse,
            payload: value
        };
    }

    /**
     * Handles GetGroupUniqueName functionality
     */
    public GetGroupUniqueName(groupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupUniqueName,
            payload: groupUniqueName
        };
    }

    /**
     * Handles GetGroupUniqueNameResponse functionality
     */
    public GetGroupUniqueNameResponse(value: BaseResponse<StockGroupResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupUniqueNameResponse,
            payload: value
        };
    }

    /**
     * Handles GetInventoryStock functionality
     */
    public GetInventoryStock(stockUniqueName: string, activeGroupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryStock,
            payload: { stockUniqueName, activeGroupUniqueName }
        };
    }

    /**
     * Handles GetInventoryStockResponse functionality
     */
    public GetInventoryStockResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryStockResponse,
            payload: value
        };
    }

    /**
     * Handles GetGroupsWithStocksHierarchyMin functionality
     */
    public GetGroupsWithStocksHierarchyMin(q?: string, page?: number, count?: number): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupsWithStocksHierarchyMin,
            payload: { q: q, page: page, count: count }
        };
    }

    /**
     * Handles GetGroupsWithStocksHierarchyMinResponse functionality
     */
    public GetGroupsWithStocksHierarchyMinResponse(value: BaseResponse<GroupsWithStocksHierarchyMin, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse,
            payload: value
        };
    }

    /**
     * Handles SetActiveStock functionality
     */
    public SetActiveStock(value: string) {
        return {
            type: InventoryActionsConst.SetActiveStock,
            payload: value
        };
    }

    /**
     * Handles SearchGroupsWithStocks functionality
     */
    public SearchGroupsWithStocks(q?: string, page?: number, count?: number): CustomActions {
        return {
            type: InventoryActionsConst.SearchGroupsWithStocks,
            payload: { q: q, page: page, count: count }
        };
    }

    /**
     * Handles SearchGroupsWithStocksResponse functionality
     */
    public SearchGroupsWithStocksResponse(value: BaseResponse<GroupsWithStocksFlatten, string>): CustomActions {
        return {
            type: InventoryActionsConst.SearchGroupsWithStocksResponse,
            payload: value
        };
    }

    /**
     * Handles ShowBranchScreen functionality
     */
    public ShowBranchScreen(bool: boolean) {
        return {
            type: InventoryActionsConst.ShowBranchScreen,
            payload: bool
        };
    }

    /**
     * Handles ShowBranchScreenSideBar functionality
     */
    public ShowBranchScreenSideBar(bool: boolean) {
        return {
            type: InventoryActionsConst.ShowBranchScreenSideBar,
            payload: bool
        };
    }
}
