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
import { CustomActions } from '../../store/custom-actions';
import { BranchTransferResponse, LinkedStocksResponse, TransferDestinationRequest, TransferProductsRequest } from '../../models/api-models/BranchTransfer';
import { SalesActions } from '../sales/sales.action';
import { forEach } from '../../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * InventoryAction actions
 * Defines inventoryaction related action creators for state management
 */
export class InventoryAction {
    /** Holds Get bulk list stock key name  */
    public static GET_BULK_STOCK_LIST = 'GetBulkStockList';

    public addNewGroup$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.AddNewGroup),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.CreateStockGroup(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.addNewGroupResponse(response))));


    public addNewGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.AddNewGroupResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.UpdateGroup),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.UpdateStockGroup(action.payload?.body, action.payload.stockGroupUniquename)),
            /**
             * Handles map functionality
             */
            map(response => this.updateGroupResponse(response))));


    public updateGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.UpdateGroupResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<StockGroupResponse, StockGroupRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.RemoveGroup),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.DeleteStockGroup(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.removeGroupResponse(response))));


    public removeGroupResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.RemoveGroupResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetStockUniqueName),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetStockDetails(action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetStockUniqueNameResponse(response);
            })));


    public GetStockUniqueNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetStockUniqueNameResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));


    public GetStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetStocks(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetStockResponse(response);
            })));


    public GetStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetStockResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    // Get manufacturing stock

    public GetManufacturingStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetManufacturingStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocks()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetManufacturingStockResponse(response);
            })));


    public GetManufacturingStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetManufacturingStockResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));

    // Get manufacturing stock for create manufacturing

    public GetManufacturingStockForCreate$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetManufacturingStockForCreate),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetManufacturingStocksForCreateMF()),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetManufacturingCreateStockResponse(response);
            })));


    public GetManufacturingStockForCreateResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetManufacturingStockForCreateResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));


    public createStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.CreateStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.CreateStock(action.payload.stock, action.payload.stockGroupUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => this.createStockResponse(response))));


    public createStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.CreateStockResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
                if (data?.status === 'error') {
                    this._toasty.clearAllToaster();
                    this._toasty.errorToast(data.message, data.code);
                } else {
                    this._toasty.successToast('Stock Created Successfully');
                    this.store.dispatch(this._salesActions.createStockAcSuccess({
                        name: data?.body?.name,
                        uniqueName: data?.body?.uniqueName,
                        linkedAc: data?.body?.salesAccountDetails ? data?.body?.salesAccountDetails.accountUniqueName :
                            data?.body?.purchaseAccountDetails ? data?.body?.purchaseAccountDetails.accountUniqueName : ''
                    }));
                    return this.resetActiveStock();
                }
                return { type: 'EmptyAction' };
            })));


    public updateStock$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.UpdateStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.UpdateStock(action.payload.stock, action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => this.updateStockResponse(response))));


    public updateStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.UpdateStockResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<StockDetailResponse, CreateStockRequest> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.RemoveStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.DeleteStock(action.payload.stockGroupUniqueName, action.payload.stockUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => this.removeStockResponse(response))));


    public removeStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.RemoveStockResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<string, string> = response.payload;
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetStockWithUniqueName),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.GetStockUniqueNameWithDetail(action.payload.stockUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.GetStockWithUniqueNameResponse(response);
            })));


    public GetStockWithUniqueNameResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.GetStockWithUniqueNameResponse),
            /**
             * Handles map functionality
             */
            map((action: CustomActions) => {
                return { type: 'EmptyAction' };
            })));


    public CreateBranchTransfer$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.BranchTransfer(action.payload)),
            /**
             * Handles map functionality
             */
            map((res: BaseResponse<BranchTransferResponse, TransferDestinationRequest | TransferProductsRequest>) => {
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS),
            /**
             * Handles switchMap functionality
             */
            switchMap(() => this._inventoryService.getLinkedStocks()),
            /**
             * Handles map functionality
             */
            map((res: BaseResponse<LinkedStocksResponse, string>) => {
                /**
                 * Handles if functionality
                 */
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
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.MoveStock),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.MoveStock(action.payload.activeGroup, action.payload.stockUniqueName, action.payload.groupUniqueName)),
            /**
             * Handles map functionality
             */
            map(response => {
                return this.MoveStockResponse(response);
            })));


    public MoveStockResponse$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryActionsConst.MoveStockResponse),
            /**
             * Handles map functionality
             */
            map((response: CustomActions) => {
                let data: BaseResponse<any, any> = response.payload;
                /**
                 * Handles if functionality
                 */
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

    /**
     * Call API Using Effect and send response in store
     *
     * @type {Observable<Action>}
     * @memberof InventoryAction
     */
    public getBulkStockList$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            /**
             * Handles ofType functionality
             */
            ofType(InventoryAction.GET_BULK_STOCK_LIST),
            /**
             * Handles switchMap functionality
             */
            switchMap((action: CustomActions) => this._inventoryService.getBulkStockList(action.payload)),
            /**
             * Handles map functionality
             */
            map(response => this.getBulkStockListResponse(response))));

    /**
     * Creates an instance of actions
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, private _inventoryService: InventoryService, private action$: Actions,
        private _toasty: ToasterService, private router: Router, private _salesActions: SalesActions) {

    }

    /**
     * Handles addNewGroup functionality
     */
    public addNewGroup(value: StockGroupRequest): CustomActions {
        return {
            type: InventoryActionsConst.AddNewGroup,
            payload: value
        };
    }

    /**
     * Handles addNewGroupResponse functionality
     */
    public addNewGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): CustomActions {
        return {
            type: InventoryActionsConst.AddNewGroupResponse,
            payload: value
        };
    }

    /**
     * Creates new stock
     */
    public createStock(value: CreateStockRequest, stockGroupUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.CreateStock,
            payload: { stock: value, stockGroupUniqueName }
        };
    }

    /**
     * Resets createstockflags to default state
     */
    public resetCreateStockFlags(): CustomActions {
        return {
            type: InventoryActionsConst.ResetCreateStockFlags
        }
    }

    /**
     * Creates new stockresponse
     */
    public createStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): CustomActions {
        return {
            type: InventoryActionsConst.CreateStockResponse,
            payload: value
        };
    }

    /**
     * Updates existing stock
     */
    public updateStock(value: CreateStockRequest, stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.UpdateStock,
            payload: { stock: value, stockGroupUniqueName, stockUniqueName }
        };
    }

    /**
     * Updates existing stockresponse
     */
    public updateStockResponse(value: BaseResponse<StockDetailResponse, CreateStockRequest>): CustomActions {
        return {
            type: InventoryActionsConst.UpdateStockResponse,
            payload: value
        };
    }

    /**
     * Updates existing group
     */
    public updateGroup(value: StockGroupRequest, stockGroupUniquename: string): CustomActions {
        return {
            type: InventoryActionsConst.UpdateGroup,
            payload: { body: value, stockGroupUniquename }
        };
    }

    /**
     * Updates existing groupresponse
     */
    public updateGroupResponse(value: BaseResponse<StockGroupResponse, StockGroupRequest>): CustomActions {
        return {
            type: InventoryActionsConst.UpdateGroupResponse,
            payload: value
        };
    }

    /**
     * Deletes group
     */
    public removeGroup(value: string): CustomActions {
        return {
            type: InventoryActionsConst.RemoveGroup,
            payload: value
        };
    }

    /**
     * Deletes groupresponse
     */
    public removeGroupResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: InventoryActionsConst.RemoveGroupResponse,
            payload: value
        };
    }

    /**
     * Deletes stock
     */
    public removeStock(stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.RemoveStock,
            payload: { stockGroupUniqueName, stockUniqueName }
        };
    }

    /**
     * Deletes stockresponse
     */
    public removeStockResponse(value: BaseResponse<string, string>): CustomActions {
        return {
            type: InventoryActionsConst.RemoveStockResponse,
            payload: value
        };
    }

    /**
     * Resets activegroup to default state
     */
    public resetActiveGroup(): CustomActions {
        return {
            type: InventoryActionsConst.ResetActiveGroup
        };
    }

    /**
     * Handles GetStockUniqueName functionality
     */
    public GetStockUniqueName(stockGroupUniqueName: string, stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetStockUniqueName,
            payload: { stockGroupUniqueName, stockUniqueName }
        };
    }

    /**
     * Handles GetStockUniqueNameResponse functionality
     */
    public GetStockUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetStockUniqueNameResponse,
            payload: value
        };
    }

    /**
     * Handles GetStock functionality
     */
    public GetStock(companyUniqueName: string = '', branchUniqueName?: string): CustomActions {
        return {
            type: InventoryActionsConst.GetStock,
            payload: { companyUniqueName, branchUniqueName }
        };
    }

    /**
     * Handles GetStockResponse functionality
     */
    public GetStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetStockResponse,
            payload: value
        };
    }

    // Get Stock for manufacturing
    /**
     * Handles GetManufacturingStock functionality
     */
    public GetManufacturingStock(): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStock
        };
    }

    /**
     * Handles GetManufacturingStockResponse functionality
     */
    public GetManufacturingStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStockResponse,
            payload: value
        };
    }

    // Get Stock for create manufacturing
    /**
     * Handles GetManufacturingCreateStock functionality
     */
    public GetManufacturingCreateStock(): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStockForCreate
        };
    }

    /**
     * Handles GetManufacturingCreateStockResponse functionality
     */
    public GetManufacturingCreateStockResponse(value: BaseResponse<StocksResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetManufacturingStockForCreateResponse,
            payload: value
        };
    }

    /**
     * Resets activestock to default state
     */
    public resetActiveStock(): CustomActions {
        return {
            type: InventoryActionsConst.ResetActiveStock
        };
    }

    /**
     * Shows loaderforstock element
     */
    public showLoaderForStock(): CustomActions {
        return {
            type: InventoryActionsConst.ShowLoadingForStockEditInProcess
        };
    }

    /**
     * Hides loaderforstock element
     */
    public hideLoaderForStock(): CustomActions {
        return {
            type: InventoryActionsConst.HideLoadingForStockEditInProcess
        };
    }

    /**
     * Handles ResetInventoryState functionality
     */
    public ResetInventoryState(): CustomActions {
        return {
            type: InventoryActionsConst.ResetInventoryState
        };
    }

    /**
     * Handles OpenInventoryAsidePane functionality
     */
    public OpenInventoryAsidePane(value: boolean) {
        return {
            type: InventoryActionsConst.NewGroupAsidePane,
            payload: value
        };
    }

    /**
     * Handles OpenCustomUnitPane functionality
     */
    public OpenCustomUnitPane(value: boolean) {
        return {
            type: InventoryActionsConst.NewCustomUnitAsidePane,
            payload: value
        };
    }

    /**
     * Handles GetStockWithUniqueName functionality
     */
    public GetStockWithUniqueName(stockUniqueName: string): CustomActions {
        return {
            type: InventoryActionsConst.GetStockWithUniqueName,
            payload: { stockUniqueName }
        };
    }

    /**
     * Handles GetStockWithUniqueNameResponse functionality
     */
    public GetStockWithUniqueNameResponse(value: BaseResponse<StockDetailResponse, string>): CustomActions {
        return {
            type: InventoryActionsConst.GetStockWithUniqueNameResponse,
            payload: value
        };
    }

    /**
     * Handles ManageInventoryAside functionality
     */
    public ManageInventoryAside(value: object) {
        return {
            type: InventoryActionsConst.ManageInventoryAside,
            payload: value
        };
    }

    /**
     * Handles CreateBranchTransfer functionality
     */
    public CreateBranchTransfer(modal: TransferDestinationRequest | TransferProductsRequest): CustomActions {
        return {
            type: INVENTORY_BRANCH_TRANSFER.CREATE_TRANSFER,
            payload: modal
        };
    }

    /**
     * Handles GetAllLinkedStocks functionality
     */
    public GetAllLinkedStocks(): CustomActions {
        return {
            type: INVENTORY_LINKED_STOCKS.GET_LINKED_STOCKS
        };
    }

    /**
     * Handles ResetBranchTransferState functionality
     */
    public ResetBranchTransferState(): CustomActions {
        return {
            type: INVENTORY_BRANCH_TRANSFER.RESET_BRANCH_TRANSFER_STATE
        };
    }

    /**
     * Handles MoveStock functionality
     */
    public MoveStock(activeGroup, stockUniqueName, groupUniqueName): CustomActions {
        return {
            type: InventoryActionsConst.MoveStock,
            payload: { activeGroup, stockUniqueName, groupUniqueName }
        };
    }

    /**
     * Handles MoveStockResponse functionality
     */
    public MoveStockResponse(response): CustomActions {
        return {
            type: InventoryActionsConst.MoveStockResponse,
            payload: response
        };
    }
    /**
     * Use to Call Bulk Stock list API
     *
     * @param {*} response
     * @return {*}  {CustomActions}
     * @memberof InventoryAction
     */
    public getBulkStockList(response): CustomActions {
        return {
            type: InventoryAction.GET_BULK_STOCK_LIST,
            payload: response
        };
    }
    /**
     * Set api data to custom key
     *
     * @param {BaseResponse<any, any>} value
     * @return {*}  {CustomActions}
     * @memberof InventoryAction
     */
    public getBulkStockListResponse(value: BaseResponse<any, any>): CustomActions {
        const data = value.status === 'error' ? value : value.body;
        /**
         * Handles if functionality
         */
        if (data?.results && data?.results.length > 0) {
            (Array.isArray(data.results) ? data.results : []).forEach((result: any) => {
                result.variantName = result?.variantName ? result.variantName : null,
                    result.variantUniqueName = result?.variantUniqueName ? result.variantUniqueName : null,
                    result.stockName = result?.stockName ? result.stockName : null,
                    result.stockUniqueName = result?.stockUniqueName ? result.stockUniqueName : null,
                    result.stockGroupName = result?.stockGroupName ? result.stockGroupName : null,
                    result.stockGroupUniqueName = result?.stockGroupUniqueName ? result.stockGroupUniqueName : null,
                    result.stockUnitName = result?.stockUnitName ? result.stockUnitName : null,
                    result.stockUnitCode = result?.stockUnitCode ? result.stockUnitCode : null,
                    result.purchaseUnits = result?.purchaseUnits ? result.purchaseUnits : null,
                    result.purchaseAccountName = result?.purchaseAccountName ? result.purchaseAccountName : null,
                    result.purchaseAccountUniqueName = result?.purchaseAccountUniqueName ? result.purchaseAccountUniqueName : null,
                    result.purchaseRate = result?.purchaseRate ? result.purchaseRate : null,
                    result.purchaseTaxInclusive = result.purchaseTaxInclusive === true || result?.purchaseTaxInclusive === false ? result.purchaseTaxInclusive : null,
                    result.salesUnits = result?.salesUnits ? result.salesUnits : null,
                    result.salesAccountName = result?.salesAccountName ? result.salesAccountName : null,
                    result.salesAccountUniqueName = result?.salesAccountUniqueName ? result.salesAccountUniqueName : null,
                    result.salesRate = result?.salesRate ? result.salesRate : null,
                    result.salesTaxInclusive = result.salesTaxInclusive === true || result?.salesTaxInclusive === false ? result.salesTaxInclusive : null,
                    result.fixedAssetTaxInclusive = result.fixedAssetTaxInclusive === true || result?.fixedAssetTaxInclusive === false ? result.fixedAssetTaxInclusive : null,
                    result.fixedAssetRate = result?.fixedAssetRate ? result.fixedAssetRate : null,
                    result.fixedAssetUnits = result?.fixedAssetUnits ? result.fixedAssetUnits : null,
                    result.fixedAssetAccountName = result?.fixedAssetAccountName ? result.fixedAssetAccountName : null,
                    result.fixedAssetAccountUniqueName = result?.fixedAssetAccountUniqueName ? result.fixedAssetAccountUniqueName : null,
                    result.hsnNo = result?.hsnNo ? result.hsnNo : null,
                    result.sacNo = result?.sacNo ? result.sacNo : null,
                    result.skuCode = result?.skuCode ? result.skuCode : null,
                    result.archive = result?.archive === true || result?.archive === false ? result.archive : null,
                    result.taxes = result?.taxes ? result.taxes : null
            });
        }
        return {
            type: InventoryActionsConst.BulkStockResponse,
            payload: data
        };
    }
}
