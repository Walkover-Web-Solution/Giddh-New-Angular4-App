import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { VoucherComponentStore } from "../vouchers.store";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { InvoiceActions } from "../../actions/invoice/invoice.actions";
import { GeneralService } from "../../services/general.service";
import { VoucherTypeEnum } from "../../models/api-models/Sales";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherCreateComponent implements OnInit, OnDestroy {
    /** Holds current voucher type */
    public voucherType: string = "";
    /** Holds images folder path */
    public imgPath: string = "";
    /** Invoice settings Observable */
    public invoiceSettings$: Observable<any> = this.componentStore.invoiceSettings$;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** Invoice Settings */
    public invoiceSettings: any;
    /** True if round off will be applicable */
    public applyRoundOff: boolean = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private componentStore: VoucherComponentStore,
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions,
        private generalService: GeneralService
    ) {
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    }

    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        this.getInvoiceSettings();
    }

    public ngOnDestroy(): void {

    }

    private getInvoiceSettings(): void {
        this.invoiceSettings$.subscribe(settings => {
            if (!settings) {
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
            } else {
                this.invoiceSettings = settings;

                if (this.voucherApiVersion === 2) {
                    if (this.voucherType === VoucherTypeEnum.sales || this.voucherType === VoucherTypeEnum.cash) {
                        this.applyRoundOff = settings.invoiceSettings.salesRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.purchase) {
                        this.applyRoundOff = settings.invoiceSettings.purchaseRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.debitNote) {
                        this.applyRoundOff = settings.invoiceSettings.debitNoteRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.creditNote) {
                        this.applyRoundOff = settings.invoiceSettings.creditNoteRoundOff;
                    } else if (this.voucherType === VoucherTypeEnum.estimate || this.voucherType === VoucherTypeEnum.generateEstimate || this.voucherType === VoucherTypeEnum.proforma || this.voucherType === VoucherTypeEnum.generateProforma) {
                        this.applyRoundOff = true;
                    }
                } else {
                    this.applyRoundOff = true;
                }
            }
        });
    }
}