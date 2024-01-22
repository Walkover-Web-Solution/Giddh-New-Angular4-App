import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { InvoiceActions } from "../../actions/invoice/invoice.actions";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherCreateComponent implements OnInit, OnDestroy {
    public moduleType: string = "";
    /** Holds images folder path */
    public imgPath: string = "";
    public invoiceSettings$: Observable<any> = this.componentStore.invoiceSettings$;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private componentStore: VoucherComponentStore,
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions
    ) {
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    }

    public ngOnInit(): void {
        this.invoiceSettings$.subscribe(invoiceSettings => {
            if (!invoiceSettings) {
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
            } else {
                console.log(invoiceSettings);
            }
        });
    }

    public ngOnDestroy(): void {
        
    }
    
}