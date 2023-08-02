import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { cloneDeep } from "../../lodash-optimized";
import { ExportBodyRequest } from "../../models/api-models/DaybookRequest";
import { LedgerService } from "../../services/ledger.service";
import { ToasterService } from "../../services/toaster.service";

@Component({
    selector: "sales-purchase-register-export",
    templateUrl: "./sales-purchase-register-export.component.html",
    styleUrls: ["./sales-purchase-register-export.component.scss"],
})
export class SalesPurchaseRegisterExportComponent implements OnInit {
    /** Form Group for export  form */
    public exportForm: FormGroup;
    /** To destroy observers */
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private dialog: MatDialog,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {}

    /**
     *  This hook will use for component initialization
     *
     * @memberof SalesPurchaseRegisterExportComponent
     */
    public ngOnInit(): void {
        this.initExportForm();
    }

    /**
     * This will use for initial export form
     *
     * @memberof SalesPurchaseRegisterExportComponent
     */
    public initExportForm(): void {
        this.exportForm = this.formBuilder.group({
            showVoucherType: new FormControl(false),
            showVoucherNumber: new FormControl(false),
            showDiscount: new FormControl(false),
            showTax: new FormControl(false),
            showGroup: new FormControl(false),
            showTaxNumber: new FormControl(false),
            showAddress: new FormControl(false),
            showPincode: new FormControl(false),
            showEmail: new FormControl(false),
            showMobileNumber: new FormControl(false),
            showSalesPurchaseAccount: new FormControl(false),
            showStock: new FormControl(false),
        });
    }

    /**
     * This will use for close dialog
     *
     * @memberof SalesPurchaseRegisterExportComponent
     */
    public onCancel(): void {
        this.dialog?.closeAll();
    }

    /**
     * Exports sales/purchase register detailed report
     *
     * @memberof SalesPurchaseRegisterExportComponent
     */
    public export(): void {
        let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
        let body = cloneDeep(this.inputData);
        exportBodyRequest.from = body?.from;
        exportBodyRequest.to = body?.to;
        exportBodyRequest.exportType = body?.exportType;
        exportBodyRequest.fileType = body?.fileType;
        exportBodyRequest.isExpanded = body?.expand;
        exportBodyRequest.q = body?.q;
        exportBodyRequest.branchUniqueName = body?.branchUniqueName;
        exportBodyRequest.columnsToExport = ["Account"];
        if (this.exportForm.value.showVoucherType) {
            exportBodyRequest.columnsToExport.push("Voucher Type");
        }
        if (this.exportForm.value.showVoucherNumber) {
            exportBodyRequest.columnsToExport.push("Voucher No");
        }
        if (this.exportForm.value.showDiscount) {
            exportBodyRequest.columnsToExport.push("Discount");
        }
        if (this.exportForm.value.showTax) {
            exportBodyRequest.columnsToExport.push("Tax");
        }
        if (this.exportForm.value.showGroup) {
            exportBodyRequest.columnsToExport.push("Group");
            exportBodyRequest.columnsToExport.push("Group UniqueName");
        }
        if (this.exportForm.value.showTaxNumber) {
            exportBodyRequest.columnsToExport.push("Tax Number");
        }
        if (this.exportForm.value.showAddress) {
            exportBodyRequest.columnsToExport.push("Address");
        }
        if (this.exportForm.value.showPincode) {
            exportBodyRequest.columnsToExport.push("Pincode");
        }
        if (this.exportForm.value.showEmail) {
            exportBodyRequest.columnsToExport.push("Email");
        }
        if (this.exportForm.value.showMobileNumber) {
            exportBodyRequest.columnsToExport.push("Mobile No");
        }
        if (this.exportForm.value.showSalesPurchaseAccount) {
            exportBodyRequest.columnsToExport.push("SalesPurchase Account");
            exportBodyRequest.columnsToExport.push("SalesPurchase Account UniqueName");
        }
        if (this.exportForm.value.showStock) {
            exportBodyRequest.columnsToExport.push("Stock");
        }
        console.log(exportBodyRequest);
        this.ledgerService
            .exportData(exportBodyRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((response) => {
                if (response?.status === "success") {
                    this.toaster.successToast(response?.body);
                    this.router.navigate(["/pages/downloads"]);
                } else {
                    this.toaster.errorToast(response?.message);
                }
            });
    }

    /**
     * Releases the memory
     *
     * @memberof SalesPurchaseRegisterExportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
