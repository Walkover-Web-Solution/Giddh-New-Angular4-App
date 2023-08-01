import { Component, OnInit } from '@angular/core';
import { ExportBodyRequest } from '../../models/api-models/DaybookRequest';

@Component({
  selector: 'sales-purchase-register-export',
  templateUrl: './sales-purchase-register-export.component.html',
  styleUrls: ['./sales-purchase-register-export.component.css']
})
export class SalesPurchaseRegisterExportComponent implements OnInit {

  constructor() { }

    public ngOnInit() {
    }
    /**
   * Exports sales register detailed report
   *
   * @memberof SalesPurchaseRegisterExportComponent
   */
    public export(): void {
        //     let exportBodyRequest: ExportBodyRequest = new ExportBodyRequest();
        //     exportBodyRequest.from = this.from;
        //     exportBodyRequest.to = this.to;
        //     exportBodyRequest.exportType = "SALES_REGISTER_DETAILED_EXPORT";
        //     exportBodyRequest.fileType = "CSV";
        //     exportBodyRequest.isExpanded = this.expand;
        //     exportBodyRequest.q = this.voucherNumberInput?.value;
        //     exportBodyRequest.branchUniqueName = this.getDetailedsalesRequestFilter?.branchUniqueName;
        //     exportBodyRequest.columnsToExport = [];
        //     if (this.showFieldFilter.voucher_type) {
        //         exportBodyRequest.columnsToExport.push("Voucher Type");
        //     }
        //     if (this.showFieldFilter.voucher_no) {
        //         exportBodyRequest.columnsToExport.push("Voucher No");
        //     }
        //     if (this.showFieldFilter.qty_rate) {
        //         exportBodyRequest.columnsToExport.push("Qty/Unit");
        //     }
        //     if (this.showFieldFilter.discount) {
        //         exportBodyRequest.columnsToExport.push("Discount");
        //     }
        //     if (this.showFieldFilter.tax) {
        //         exportBodyRequest.columnsToExport.push("Tax");
        //     }

        //     this.ledgerService.exportData(exportBodyRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
        //         if (response?.status === 'success') {
        //             this.toaster.successToast(response?.body);
        //             this.router.navigate(["/pages/downloads"]);
        //         } else {
        //             this.toaster.errorToast(response?.message);
        //         }
        //     });
        // }
    }



}
