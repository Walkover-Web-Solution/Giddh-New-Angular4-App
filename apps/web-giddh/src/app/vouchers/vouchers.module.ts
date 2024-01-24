import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { VouchersRoutingModule } from "./vouchers.routing.module";
import { VoucherListComponent } from "./list/list.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { AdvanceSearchComponent } from "./advance-search/advance-search.component";
import { GiddhDatepickerModule } from "../theme/giddh-datepicker/giddh-datepicker.module";
import { BulkExportComponent } from "./bulk-export/bulk-export.component";
import { MatSelectModule } from "@angular/material/select";
import { PaymentDialogComponent } from "./payment-dialog/payment-dialog.component";
import { AdjustPaymentDialogComponent } from "./adjust-payment-dialog/adjust-payment-dialog.component";

@NgModule({
    declarations: [
        MainComponent,
        VoucherListComponent,
        AdvanceSearchComponent,
        BulkExportComponent,
        PaymentDialogComponent,
        AdjustPaymentDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        VouchersRoutingModule,
        MatTabsModule,
        MatTableModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        FormFieldsModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatDialogModule,
        GiddhDatepickerModule,
        MatSelectModule
    ],
    exports: [
        
    ]
})
export class VouchersModule {

}