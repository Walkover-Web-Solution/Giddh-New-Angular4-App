import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { BulkExportComponent } from "./bulk-export/bulk-export.component";
import { PaymentDialogComponent } from "./payment-dialog/payment-dialog.component";
import { AdjustPaymentDialogComponent } from "./adjust-payment-dialog/adjust-payment-dialog.component";
import { VoucherCreateComponent } from "./create/create.component";
import { BulkUpdateComponent } from "./bulk-update/bulk-update.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { WatchVideoModule } from "../theme/watch-video/watch-video.module";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { VouchersPreviewComponent } from "./preview/preview.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { HistoryDialogComponent } from "./history-dialog/history-dialog.component";
import { OtherTaxModule } from "../theme/other-tax/other-tax.module";
import { AddBulkItemsModule } from "../theme/add-bulk-items/add-bulk-items.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";

@NgModule({
    declarations: [
        MainComponent,
        VoucherListComponent,
        VouchersPreviewComponent,
        VoucherCreateComponent,
        AdvanceSearchComponent,
        BulkExportComponent,
        PaymentDialogComponent,
        AdjustPaymentDialogComponent,
        BulkUpdateComponent,
        HistoryDialogComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        FormsModule,
        FormFieldsModule,
        VouchersRoutingModule,
        MatTabsModule,
        MatTableModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        MatTooltipModule,
        MatCheckboxModule,
        GiddhDatepickerModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule,
        MatListModule,
        MatCardModule,
        MatRadioModule,
        MatFormFieldModule,
        NgxMatSelectSearchModule,
        MatDialogModule,
        MatExpansionModule,
        WatchVideoModule,
        HamburgerMenuModule,
        ScrollingModule,
        NoDataModule,
        OtherTaxModule,
        AddBulkItemsModule,
        TranslateDirectiveModule
    ],
    exports: [

    ]
})
export class VouchersModule {

}