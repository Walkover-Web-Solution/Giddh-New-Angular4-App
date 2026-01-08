import { Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { Observable, switchMap, catchError, EMPTY } from "rxjs";
import { ToasterService } from "../../../services/toaster.service";
import { LedgerService } from "../../../services/ledger.service";
import { IVariant } from "../../../models/api-models/Ledger";
import { SearchService } from "../../../services/search.service";

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

@Injectable()
export class AddBulkItemsComponentStore extends ComponentStore<AddBulkItemsState> {

    constructor(
        private ledgerService: LedgerService,
        private toaster : ToasterService
    ) {
        super(DEFAULT_STATE);
    }

    public voucherStockResults$ = this.select((state) => state.voucherStockResults);
    public stockVariants$ = this.select((state) => state.stockVariants);
    public addBulkItemsInProgress$ = this.select((state) => state.addBulkItemsInProgress);
    public addBulkItemsSuccess$ = this.select((state) => state.addBulkItemsSuccess);

    readonly getStockVariants = this.effect((data: Observable<{ q: any, index: number }>) => {
        return data.pipe(
            switchMap((req) => {
                return this.ledgerService.loadStockVariants(req.q).pipe(
                    tapResponse(
                        (res: Array<IVariant>) => {
                            return this.patchState({
                                stockVariants: { results: res?.map(res => { return { label: res.name, value: res.uniqueName } }) ?? [], entryIndex: req.index }
                            });
                        },
                        (error: any) => {
                            this.toaster.showSnackBar("error", error);
                            return this.patchState({
                                stockVariants: { results: [], entryIndex: req.index }
                            });
                        }
                    ),
                    catchError((err) => EMPTY)
                );
            })
        );
    });
}