import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CreateStockRequest, StockDetailResponse, StockGroupRequest, StockGroupResponse, StocksResponse } from '../../models/api-models/Inventory';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { InventoryService } from '../../services/inventory.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { INVENTORY_BRANCH_TRANSFER, INVENTORY_LINKED_STOCKS, InventoryActionsConst } from './inventory.const';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/customActions';
import { BranchTransferResponse, LinkedStocksResponse, TransferDestinationRequest, TransferProductsRequest } from '../../models/api-models/BranchTransfer';
import { SalesActions } from '../sales/sales.action';

@Injectable()
export class InventoryAction {
    @Effect()
    public addNewGroup$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.AddNewGroup).pipe(
            switchMap((action: CustomActions) => this._inventoryService.CreateStockGroup(action.payload)),
            map(response => this.addNewGroupResponse(response)));

    @Effect()
    public addNewGroupResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.AddNewGroupResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Group Created Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public updateGroup$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.UpdateGroup).pipe(
            switchMap((action: CustomActions) => this._inventoryService.UpdateStockGroup(action.payload.body, action.payload.stockGroupUniquename)),
            map(response => this.updateGroupResponse(response)));

    @Effect()
    public updateGroupResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.UpdateGroupResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Group Updated Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public removeGroup$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.RemoveGroup).pipe(
            switchMap((action: CustomActions) => this._inventoryService.DeleteStockGroup(action.payload)),
            map(response => this.removeGroupResponse(response)));

    @Effect()
    public removeGroupResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.RemoveGroupResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body, '');
                    return this.resetActiveGroup();
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetStockUniqueName$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetStockUniqueName).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetStockDetails(action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            map(response => {
                return this.GetStockUniqueNameResponse(response);
            }));

    @Effect()
    public GetStockUniqueNameResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetStockUniqueNameResponse).pipe(
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetStock).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetStocks(action.payload)),
            map(response => {
                return this.GetStockResponse(response);
            }));

    @Effect()
    public GetStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetStockResponse).pipe(
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    // Get manufacturing stock
    @Effect()
    public GetManufacturingStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetManufacturingStock).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocks()),
            map(response => {
                return this.GetManufacturingStockResponse(response);
            }));

    @Effect()
    public GetManufacturingStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetManufacturingStockResponse).pipe(
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    // Get manufacturing stock for create manufacturing
    @Effect()
    public GetManufacturingStockForCreate$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetManufacturingStockForCreate).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocksForCreateMF()),
            map(response => {
                return this.GetManufacturingCreateStockResponse(response);
            }));

    @Effect()
    public GetManufacturingStockForCreateResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetManufacturingStockForCreateResponse).pipe(
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public createStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.CreateStock).pipe(
            switchMap((action: CustomActions) => this._inventoryService.CreateStock(action.payload.stock, action.payload.stockGroupUniqueName)),
            map(response => this.createStockResponse(response)));

    @Effect()
    public createStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.CreateStockResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName, 'add-stock']);
                    this._toasty.successToast('Stock Created Successfully');
                    this.store.dispatch(this._salesActions.createStockAcSuccess({
                        name: data.body.name,
                        uniqueName: data.body.uniqueName,
                        linkedAc: data.body.salesAccountDetails ? data.body.salesAccountDetails.accountUniqueName :
                            data.body.purchaseAccountDetails ? data.body.purchaseAccountDetails.accountUniqueName : ''
                    }));
                    return this.resetActiveStock();
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public updateStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.UpdateStock).pipe(
            switchMap((action: CustomActions) => this._inventoryService.UpdateStock(action.payload.stock, action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            map(response => this.updateStockResponse(response)));

    @Effect()
    public updateStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.UpdateStockResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
                if (data.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    // this.router.navigate(['/pages', 'inventory', 'add-group', data.queryString.stockGroupUniqueName, 'add-stock', data.body.uniqueName]);
                    this._toasty.successToast('Stock Updated Successfully');
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public removeStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.RemoveStock).pipe(
            switchMap((action: CustomActions) => this._inventoryService.DeleteStock(action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            map(response => this.removeStockResponse(response)));

    @Effect()
    public removeStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.RemoveStockResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body, '');
                    this.router.navigateByUrl('/pages/inventory/group' + data.queryString.stockGroupUniqueName + '/report', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/pages', 'inventory', 'group', data.queryString.stockGroupUniqueName, 'report']);
                    })
                }
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public GetStockWithUniqueName$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetStockWithUniqueName).pipe(
            switchMap((action: CustomActions) => this._inventoryService.GetStockUniqueNameWithDetail(action.payload.stockUniqueName)),
            map(response => {
                return this.GetStockWithUniqueNameResponse(response);
            }));

    @Effect()
    public GetStockWithUniqueNameResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.GetStockWithUniqueNameResponse).pipe(
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            }));

    @Effect()
    public CreateBranchTransfer$: Observable<Action> = this.action$
        .ofType(INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER).pipe(
            switchMap((action: CustomActions) => this._inventoryService.BranchTransfer(action.payload)),
            map((res: BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>) => {
                if (res.status === 'error') {
                    this._toasty.errorToast(res.message);
                } else {
                    this._toasty.successToast('Branch transferred successfully');
                }
                return {
                    type: INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER_RESPONSE,
                    payload: res.status === 'success' ? res.body : null
                } as CustomActions;
            }));

    @Effect()
    public GetLinkedStocks$: Observable<Action> = this.action$
        .ofType(INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS).pipe(
            switchMap(() => this._inventoryService.getLinkedStocks()),
            map((res: BaseResponse<LinkedStocksResponse, string>) => {
                if (res.status === 'error') {
                    this._toasty.errorToast(res.message);
                }

                return {
                    type: INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS_RESPONSE,
                    payload: res.status === 'success' ? res.body : null
                };
            }));

    @Effect()
    public MoveStock$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.MoveStock).pipe(
            switchMap((action: CustomActions) => this._inventoryService.MoveStock(action.payload.activeGroup, action.payload.stockUniqueName, action.payload.groupUniqueName)),
            map(response => {
                return this.MoveStockResponse(response);
            }));

    @Effect()
    public MoveStockResponse$: Observable<Action> = this.action$
        .ofType(InventoryActionsConst.MoveStockResponse).pipe(
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data.body, '');
                    this.OpenInventoryAsidePane(false);
                    let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
                    this.store.dispatch(this.ManageInventoryAside(objToSend));

                    this.router.navigateByUrl('/pages/inventory/group' + data.queryString.stockGroupUniqueName + '/report', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/pages', 'inventory', 'group', data.queryString.stockGroupUniqueName, 'report']);
                    })
                    return this.resetActiveStock();
                }
                return { type: 'EmptyAction' };
            }));

    constructor(private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService, private router: Router, private _salesActions: SalesActions) {

    }

    public addNewGroup(value: StockGroupRequest): CustomActions {
        return {
            type: InventoryActionsConst.AddNewGroup,
            payload: value
        };
    }

    public addNewGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): CustomActions {
        return {
            type: InventoryActionsConst.AddNewGroupResponse,
            payload: value
        };
    }

    public createStock(value: CreateStockRequest, stockGroupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.CreateStock,
            payload: { stock: value, stockGroupUniqueName }
        };
    }

    public resetCreateStockFlags(): CustomActions {
        return {
            type: InventoryActionsConst.ResetCreateStockFlags
        }
    }

    public createStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): CustomActions {
        return {
            type: InventoryActionsConst.CreateStockResponse,
            payload: value
        };
    }

    public updateStock(value: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.UpdateStock,
            payload: { stock: value, stockGroupUniqueName, stockUniqueName }
        };
    }

    public updateStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): CustomActions {
        return {
            type: InventoryActionsConst.UpdateStockResponse,
            payload: value
        };
    }

    public updateGroup(value: StockGroupRequest, stockGroupUniquename: string): CustomActions {
        return {
            type: InventoryActionsConst.UpdateGroup,
            payload: { body: value, stockGroupUniquename }
        };
    }

    public updateGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): CustomActions {
        return {
            type: InventoryActionsConst.UpdateGroupResponse,
            payload: value
        };
    }

    public removeGroup(value: string): CustomActions {
        return {
            type: InventoryActionsConst.RemoveGroup,
            payload: value
        };
    }

    public removeGroupResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: InventoryActionsConst.RemoveGroupResponse,
            payload: value
        };
    }

    public removeStock(stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.RemoveStock,
            payload: { stockGroupUniqueName, stockUniqueName }
        };
    }

    public removeStockResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: InventoryActionsConst.RemoveStockResponse,
            payload: value
        };
    }

    public resetActiveGroup(): CustomActions {
        return {
            type: InventoryActionsConst.ResetActiveGroup
        };
    }

    public GetStockUniqueName(stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetStockUniqueName,
            payload: { stockGroupUniqueName, stockUniqueName }
        };
    }

    public GetStockUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetStockUniqueNameResponse,
            payload: value
        };
    }

    public GetStock(companyUniqueName: string = ''): CustomActions {
        return {
            type: InventoryActionsConst.GetStock,
            payload: companyUniqueName
        };
    }

    public GetStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetStockResponse,
            payload: value
        };
    }

    // Get Stock for manufacturing
    public GetManufacturingStock(): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStock
        };
    }

    public GetManufacturingStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStockResponse,
            payload: value
        };
    }

    // Get Stock for create manufacturing
    public GetManufacturingCreateStock(): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStockForCreate
        };
    }

    public GetManufacturingCreateStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStockForCreateResponse,
            payload: value
        };
    }

    public resetActiveStock(): CustomActions {
        return {
            type: InventoryActionsConst.ResetActiveStock
        };
    }

    public showLoaderForStock(): CustomActions {
        return {
            type: InventoryActionsConst.ShowLoadingForStockEditInProcess
        };
    }

    public hideLoaderForStock(): CustomActions {
        return {
            type: InventoryActionsConst.HideLoadingForStockEditInProcess
        };
    }

    public ResetInventoryState(): CustomActions {
        return {
            type: InventoryActionsConst.ResetInventoryState
        };
    }

    public OpenInventoryAsidePane(value: boolean) {
        return {
            type: InventoryActionsConst.NewGroupAsidePane,
            payload: value
        };
    }

    public OpenCustomUnitPane(value: boolean) {
        return {
            type: InventoryActionsConst.NewCustomUnitAsidePane,
            payload: value
        };
    }

    public GetStockWithUniqueName(stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetStockWithUniqueName,
            payload: { stockUniqueName }
        };
    }

    public GetStockWithUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetStockWithUniqueNameResponse,
            payload: value
        };
    }

    public ManageInventoryAside(value: object) {
        return {
            type: InventoryActionsConst.ManageInventoryAside,
            payload: value
        };
    }

    public CreateBranchTransfer(modal: TransferDestinationRequest | TransferProductsRequest): CustomActions {
        return {
            type: INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER,
            payload: modal
        };
    }

    public GetAllLinkedStocks(): CustomActions {
        return {
            type: INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS
        };
    }

    public ResetBranchTransferState(): CustomActions {
        return {
            type: INVENTORY_BRANCH_TRANSFER.RESET_BRANCH_TRANSFER_STATE
        };
    }

    public MoveStock(activeGroup, stockUniqueName, groupUniqueName): CustomActions {
        return {
            type: InventoryActionsConst.MoveStock,
            payload: { activeGroup, stockUniqueName, groupUniqueName }
        };
    }

    public MoveStockResponse(response): CustomActions {
        return {
            type: InventoryActionsConst.MoveStockResponse,
            payload: response
        };
    }
}
