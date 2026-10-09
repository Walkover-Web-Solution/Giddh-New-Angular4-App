import { CommonModule, TitleCasePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { LaddaModule } from "angular2-ladda";
import { AdvanceReceiptAdjustmentModule } from "../shared/advance-receipt-adjustment/advance-receipt-adjustment.module";
import { AsideMenuOtherTaxesModule } from "../shared/aside-menu-other-taxes/aside-menu-other-taxes.module";
import { AsideMenuProductServiceModule } from "../shared/aside-menu-product-service/aside-menu-product-service.module";
import { AsideMenuRecurringEntryModule } from "../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module";
import { VoucherTypeToNamePipeModule } from "../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module";
import { DecimalDigitsModule } from "../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { DigitsOnlyModule } from "../shared/helpers/directives/digitsOnly/digitsOnly.module";
import { HasFocusDirectiveModule } from "../shared/helpers/directives/has-focus/has-focus.module";
import { KeyboardShortutModule } from "../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { NgxMaskModule } from "../shared/helpers/directives/ngx-mask";
import { ReplacePipeModule } from "../shared/helpers/pipes/replace/replace.module";
import { SendEmailInvoiceModule } from "../shared/send-email-invoice/send-email-invoice.module";
import { SharedModule } from "../shared/shared.module";
import { VoucherAddBulkItemsModule } from "../shared/voucher-add-bulk-items/voucher-add-bulk-items.module";
import { DiscountControlModule } from "../theme/discount-control/discount-control.module";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { TaxControlModule } from "../theme/tax-control/tax-control.module";
import { VoucherRendererComponent } from "./voucher-renderer.component";
import { VoucherComponent } from "./voucher.component";
import { VoucherRoutingModule } from "./voucher.routing.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { WatchVideoModule } from "../theme/watch-video/watch-video.module";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDividerModule } from "@angular/material/divider";
import { OnloadDirectiveModule } from "./directive/onload.module";
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { GiddhNumberFormatModule } from "../shared/helpers/pipes/number-format/number-format.module";

@NgModule({
    imports: [
        VoucherRoutingModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        KeyboardShortutModule,
        DecimalDigitsModule,
        DigitsOnlyModule,
        SharedModule,
        AsideMenuRecurringEntryModule,
        TaxControlModule,
        DiscountControlModule,
        LaddaModule.forRoot({
            style: "slide-left",
            spinnerSize: 30,
        }),
        SendEmailInvoiceModule,
        VoucherTypeToNamePipeModule,
        GiddhNumberFormatModule,
        NgxMaskModule.forRoot(),
        AdvanceReceiptAdjustmentModule,
        HasFocusDirectiveModule,
        ReplacePipeModule,
        VoucherAddBulkItemsModule,
        AsideMenuOtherTaxesModule,
        AsideMenuProductServiceModule,
        MatButtonModule,
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatTableModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        FormFieldsModule,
        NgxMatSelectSearchModule,
        WatchVideoModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        OnloadDirectiveModule,
        GiddhDatePipe
    ],
    exports: [VoucherComponent],
    declarations: [VoucherRendererComponent, VoucherComponent],
    providers: [TitleCasePipe],
})
export class VoucherModule { }
