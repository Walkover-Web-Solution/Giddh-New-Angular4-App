import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CreateStockRequest, StockDetailResponse, StockGroupRequest, StockGroupResponse, StocksResponse } from '../../models/api-models/Inventory';
import { Action, Store } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { AppState } from '../../store/roots';
import { InventoryService } from '../../services/inventory.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { INVENTORY_BRANCH_TRANSFER, INVENTORY_LINKED_STOCKS, InventoryActionsConst } from './inventory.const';
import { Router } from '@angular/router';
import { CustomActions } from '../../store/customActions';
import { BranchTransferResponse, LinkedStocksResponse, TransferDestinationRequest, TransferProductsRequest } from '../../models/api-models/BranchTransfer';
import { SalesActions } from '../sales/sales.action';

@Injectable()
export class InventoryAction {

    public addNewGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.AddNewGroup),
            switchMap((action: CustomActions) => this._inventoryService.CreateStockGroup(action.payload)),
            map(response => this.addNewGroupResponse(response))));


    public addNewGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.AddNewGroupResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Group Created Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public updateGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.UpdateGroup),
            switchMap((action: CustomActions) => this._inventoryService.UpdateStockGroup(action.payload?.body, action.payload.stockGroupUniquename)),
            map(response => this.updateGroupResponse(response))));


    public updateGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.UpdateGroupResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Group Updated Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public removeGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.RemoveGroup),
            switchMap((action: CustomActions) => this._inventoryService.DeleteStockGroup(action.payload)),
            map(response => this.removeGroupResponse(response))));


    public removeGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.RemoveGroupResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data?.body, '');
                    return this.resetActiveGroup();
                }
                return { type: 'EmptyAction' };
            })));


    public GetStockUniqueName$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetStockUniqueName),
            switchMap((action: CustomActions) => this._inventoryService.GetStockDetails(action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            map(response => {
                return this.GetStockUniqueNameResponse(response);
            })));


    public GetStockUniqueNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetStockUniqueNameResponse),
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));


    public GetStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetStock),
            switchMap((action: CustomActions) => this._inventoryService.GetStocks(action.payload)),
            map(response => {
                return this.GetStockResponse(response);
            })));


    public GetStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetStockResponse),
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    // Get manufacturing stock

    public GetManufacturingStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetManufacturingStock),
            switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocks()),
            map(response => {
                return this.GetManufacturingStockResponse(response);
            })));


    public GetManufacturingStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetManufacturingStockResponse),
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    // Get manufacturing stock for create manufacturing

    public GetManufacturingStockForCreate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetManufacturingStockForCreate),
            switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocksForCreateMF()),
            map(response => {
                return this.GetManufacturingCreateStockResponse(response);
            })));


    public GetManufacturingStockForCreateResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetManufacturingStockForCreateResponse),
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));


    public createStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.CreateStock),
            switchMap((action: CustomActions) => this._inventoryService.CreateStock(action.payload.stock, action.payload.stockGroupUniqueName)),
            map(response => this.createStockResponse(response))));


    public createStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.CreateStockResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Stock Created Successfully');
                    this.store.dispatch(this._salesActions.createStockAcSuccess({
                        name: data?.body.name,
                        uniqueName: data?.body?.uniqueName,
                        linkedAc: data?.body.salesAccountDetails ? data?.body.salesAccountDetails.accountUniqueName :
                            data?.body.purchaseAccountDetails ? data?.body.purchaseAccountDetails.accountUniqueName : ''
                    }));
                    return this.resetActiveStock();
                }
                return { type: 'EmptyAction' };
            })));


    public updateStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.UpdateStock),
            switchMap((action: CustomActions) => this._inventoryService.UpdateStock(action.payload.stock, action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            map(response => this.updateStockResponse(response))));


    public updateStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.UpdateStockResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Stock Updated Successfully');
                }
                return { type: 'EmptyAction' };
            })));


    public removeStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.RemoveStock),
            switchMap((action: CustomActions) => this._inventoryService.DeleteStock(action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            map(response => this.removeStockResponse(response))));


    public removeStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.RemoveStockResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data?.body, '');
                    this.router.navigateByUrl('/pages/inventory/group' + data.queryString.stockGroupUniqueName + '/report', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/pages', 'inventory', 'group', data.queryString.stockGroupUniqueName, 'report']);
                    })
                }
                return { type: 'EmptyAction' };
            })));


    public GetStockWithUniqueName$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetStockWithUniqueName),
            switchMap((action: CustomActions) => this._inventoryService.GetStockUniqueNameWithDetail(action.payload.stockUniqueName)),
            map(response => {
                return this.GetStockWithUniqueNameResponse(response);
            })));


    public GetStockWithUniqueNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.GetStockWithUniqueNameResponse),
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));


    public CreateBranchTransfer$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER),
            switchMap((action: CustomActions) => this._inventoryService.BranchTransfer(action.payload)),
            map((res: BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>) => {
                if (res?.status === 'error') {
                    this._toasty.errorToast(res.message);
                } else {
                    this._toasty.successToast('Branch transferred successfully');
                }
                return {
                    type: INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER_RESPONSE,
                    payload: res?.status === 'success' ? res?.body : null
                } as CustomActions;
            })));

    public GetLinkedStocks$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS),
            switchMap(() => this._inventoryService.getLinkedStocks()),
            map((res: BaseResponse<LinkedStocksResponse, string>) => {
                if (res?.status === 'error') {
                    this._toasty.errorToast(res.message);
                }

                return {
                    type: INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS_RESPONSE,
                    payload: res?.status === 'success' ? res?.body : null
                };
            })));


    public MoveStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.MoveStock),
            switchMap((action: CustomActions) => this._inventoryService.MoveStock(action.payload.activeGroup, action.payload.stockUniqueName, action.payload.groupUniqueName)),
            map(response => {
                return this.MoveStockResponse(response);
            })));


    public MoveStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(InventoryActionsConst.MoveStockResponse),
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                if (data?.status === 'error') {
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast(data?.body, '');
                    this.OpenInventoryAsidePane(false);
                    let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
                    this.store.dispatch(this.ManageInventoryAside(objToSend));

                    this.router.navigateByUrl('/pages/inventory/group' + data.queryString.stockGroupUniqueName + '/report', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/pages', 'inventory', 'group', data.queryString.stockGroupUniqueName, 'report']);
                    })
                    return this.resetActiveStock();
                }
                return { type: 'EmptyAction' };
            })));

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

    public GetStock(companyUniqueName: string = '', branchUniqueName?: string): CustomActions {
        return {
            type: InventoryActionsConst.GetStock,
            payload: { companyUniqueName, branchUniqueName }
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
