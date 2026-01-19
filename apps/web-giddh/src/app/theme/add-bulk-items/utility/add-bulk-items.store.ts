import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY, tap } from "rxjs";
import { ToasterService } from "../../../services/toaster.service";
import { LedgerService } from "../../../services/ledger.service";
import { IVariant } from "../../../models/api-models/Ledger";
import { SearchService } from "../../../services/search.service";

/**
 * AddBulkItemsState interface definition
 * Defines the structure and contract for AddBulkItemsState objects
 */
export interface AddBulkItemsState {
    voucherStockResults: any[];
    stockVariants: { results: { label: string; value: string }[]; entryIndex: number } | null;
    addBulkItemsInProgress: boolean;
    addBulkItemsSuccess: boolean;
}

const DEFAULT_STATE: AddBulkItemsState = {
    voucherStockResults: null,
    stockVariants: null,
    addBulkItemsInProgress: null,
    addBulkItemsSuccess: null
};

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * AddBulkItemsComponentStore store
 * Manages addbulkitemscomponent state using NgRx ComponentStore
 */
export class AddBulkItemsComponentStore extends ComponentStore<AddBulkItemsState> {

    /**
     * Creates an instance of store
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private ledgerService: LedgerService,
        private toaster : ToasterService
    ) {
        /**
         * Handles super functionality
         */
        super(DEFAULT_STATE);
    }

    public voucherStockResults$ = this.select((state) => state.voucherStockResults);
    public stockVariants$ = this.select((state) => state.stockVariants);
    public addBulkItemsInProgress$ = this.select((state) => state.addBulkItemsInProgress);
    public addBulkItemsSuccess$ = this.select((state) => state.addBulkItemsSuccess);

    readonly getStockVariants = this.effect((data: Observable<{ q: any, index: number }>) => {
        return data.pipe(
            /**
             * Handles switchMap functionality
             */
            switchMap((req) => {
                return this.ledgerService.loadStockVariants(req.q).pipe(
                    /**
                     * Handles tap functionality
                     */
                    tap(
                        (res: Array<IVariant>) => {
                            return this.patchState({
                                stockVariants: { results: Array.isArray(res) ? res.map(res => { return { label: res.name, value: res.uniqueName } }) : [], entryIndex: req.index }
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                stockVariants: { results: [], entryIndex: req.index }
                            });
                        }
                    ),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}
