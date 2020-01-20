import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { GroupsWithStocksFlatten, GroupsWithStocksHierarchyMin } from '../../models/api-models/GroupsWithStocks';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { StockDetailResponse, StockGroupResponse } from '../../models/api-models/Inventory';
import { InventoryActionsConst } from './inventory.const';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToasterService } from '../../services/toaster.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { CustomActions } from '../../store/customActions';
import { InventoryAction } from './inventory.actions';

// import { from } from 'rxjs/observable/from';

@Injectable()
export class SidebarAction {
    @Effect()
    public GetInventoryGroup$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetInventoryGroup).pipe(
            tap(a => console.log('called')),
            switchMap((action: CustomActions) => {
                return this._inventoryService.GetGroupsStock(action.payload.groupUniqueName).pipe(shareReplay(), map(response => {
                    if (response.status === 'error') {
                        this._toasty.errorToast(response.message, response.code);
                    } else {
                        this.store.dispatch(this.GetInventoryGroupResponse(response));
                        // this.store.dispatch(this.OpenGroup(response.body.uniqueName));
                    }
                    return { type: 'EmptyAction' };
                }));
            }));

    // @Effect()
    // public GetInventoryGroupResponse$: Observable<Action> = this.action$
    //   .ofType(InventoryActionsConst.GetInventoryGroupResponse)
    //   .shareReplay()
    //   .map((action: CustomActions) => {
    //     let data: BaseResponse<StockGroupResponse, string> = action.payload;
    //     if (action.payload.status === 'error') {
    //       this._toasty.errorToast(action.payload.message, action.payload.code);
    //     } else {
    //       // this.store.dispatch(this.OpenGroup(data.body.uniqueName));
    //     }
    //     return { type: 'EmptyAction' };
    //   });

    @Effect()
    public GetInventoryStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetInventoryStock).pipe(
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
            }));

    @Effect()
    public GetInventoryStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetInventoryStockResponse).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, string> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                } else {
                    // this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
                    // this.store.dispatch(this.inventoryAction.ManageInventoryAside({isOpen: true, isGroup: false, isUpdate: true}));
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetGroupUniqueName$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetGroupUniqueName).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsStock(action.payload)),
            map(response => {
                return this.GetGroupUniqueNameResponse(response);
            }));

    @Effect()
    public GetGroupUniqueNameResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetGroupUniqueNameResponse).pipe(
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetGroupsWithStocksHierarchyMin$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMin).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetGroupsWithStocksHierarchyMin(action.payload)),
            map(response => {
                return this.GetGroupsWithStocksHierarchyMinResponse(response);
            }));

    @Effect()
    public GetGroupsWithStocksHierarchyMinResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetGroupsWithStocksHierarchyMinResponse).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, string> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public SearchGroupsWithStocks$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.SearchGroupsWithStocks).pipe(
            switchMap((action: CustomActions) => this._inventoryService.SearchStockGroupsWithStocks(action.payload)),
            map(response => {
                return this.SearchGroupsWithStocksResponse(response);
            }));

    @Effect()
    public SearchGroupsWithStocksResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.SearchGroupsWithStocksResponse).pipe(
            map((action: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, string> = action.payload;
                if (action.payload.status === 'error') {
                    this._toasty.errorToast(action.payload.message, action.payload.code);
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private action$: Actions,
        private _toasty: ToasterService,
        private store: Store<AppState>,
        private _inventoryService: InventoryService,
        private route: ActivatedRoute,
        private router: Router,
        private inventoryAction: InventoryAction
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

    public GetGroupsWithStocksHierarchyMin(q?: string): CustomActions {
        return {
            type: InventoryActionsConst.GetGroupsWithStocksHierarchyMin,
            payload: q
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

    public SearchGroupsWithStocks(q?: string): CustomActions {
        return {
            type: InventoryActionsConst.SearchGroupsWithStocks,
            payload: q
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
