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

@Injectable()
export class SidebarAction {

    public GetInventoryGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetInventoryGroup),
            tap(a => console.log('called')),
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetGroupsStock(action.payload?.groupUniqueName).pipe(shareReplay(), map(response => {
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
            ofType(InventoryActionsConst.GetInventoryStock),
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetStockDetails(action.payload.activeGroupUniqueName, action.payload.stockUniqueName);
            }),
            map(response => {
                if (response) {
                    return this.GetInventoryStockResponse(response);
                } else {
                    this._toasty.errorToast('Stock Not Found');
                    return { type: 'EmptyAction' };
                }
            })));

    public GetInventoryStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetInventoryStockResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public GetGroupUniqueName$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetGroupUniqueName),
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsStock(action.payload)),
            map(response => {
                return this.GetGroupUniqueNameResponse(response);
            })));

    public GetGroupUniqueNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetGroupUniqueNameResponse),
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    public GetGroupsWithStocksHierarchyMin$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMin),
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsWithStocksHierarchyMin(action.payload?.q, action.payload?.page, action.payload?.count)),
            map(response => {
                return this.GetGroupsWithStocksHierarchyMinResponse(response);
            })));

    public GetGroupsWithStocksHierarchyMinResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    public SearchGroupsWithStocks$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.SearchGroupsWithStocks),
            switchMap((action: CustomActions) => this._inventoryService.SearchStockGroupsWithStocks(action.payload?.q, action.payload?.page, action.payload?.count)),
            map(response => {
                return this.SearchGroupsWithStocksResponse(response);
            })));

    public SearchGroupsWithStocksResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.SearchGroupsWithStocksResponse),
            map((action: CustomActions) => {
                if (action.payload?.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            })));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _inventoryService: InventoryService
    ) {
    }

    public OpenGroup(groupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.InventoryGroupToggleOpen,
            payload: groupUniqueName
        };
    }

    public GetInventoryGroup(groupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryGroup,
            payload: { groupUniqueName }
        };
    }

    public GetInventoryGroupResponse(value: BaseResponse<StockGroupResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryGroupResponse,
            payload: value
        };
    }

    public GetGroupUniqueName(groupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupUniqueName,
            payload: groupUniqueName
        };
    }

    public GetGroupUniqueNameResponse(value: BaseResponse<StockGroupResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupUniqueNameResponse,
            payload: value
        };
    }

    public GetInventoryStock(stockUniqueName: string, activeGroupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryStock,
            payload: { stockUniqueName, activeGroupUniqueName }
        };
    }

    public GetInventoryStockResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetInventoryStockResponse,
            payload: value
        };
    }

    public GetGroupsWithStocksHierarchyMin(q?: string, page?: number, count?: number): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupsWithStocksHierarchyMin,
            payload: { q: q, page: page, count: count }
        };
    }

    public GetGroupsWithStocksHierarchyMinResponse(value: BaseResponse<GroupsWithStocksHierarchyMin, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse,
            payload: value
        };
    }

    public SetActiveStock(value: string) {
        return {
            type: InventoryActionsConst.SetActiveStock,
            payload: value
        };
    }

    public SearchGroupsWithStocks(q?: string, page?: number, count?: number): CustomActions {
        return {
            type: InventoryActionsConst.SearchGroupsWithStocks,
            payload: { q: q, page: page, count: count }
        };
    }

    public SearchGroupsWithStocksResponse(value: BaseResponse<GroupsWithStocksFlatten, string>): CustomActions {
        return {
            type: InventoryActionsConst.SearchGroupsWithStocksResponse,
            payload: value
        };
    }

    public ShowBranchScreen(bool: boolean) {
        return {
            type: InventoryActionsConst.ShowBranchScreen,
            payload: bool
        };
    }

    public ShowBranchScreenSideBar(bool: boolean) {
        return {
            type: InventoryActionsConst.ShowBranchScreenSideBar,
            payload: bool
        };
    }
}
