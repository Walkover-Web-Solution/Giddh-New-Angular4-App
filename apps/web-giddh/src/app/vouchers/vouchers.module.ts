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
import { EmailSendDialogComponent } from "./email-send-dialog/email-send-dialog.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { VoucherNameModule } from "./utility/pipe/voucher-name/voucher-name.module";
import { VoucherCopyLinkModule } from "./utility/pipe/voucher-copy-link/voucher-copy-link.module";
import { TaxDropdownModule } from "../theme/tax-dropdown/tax-dropdown.module";
import { DiscountDropdownModule } from "../theme/discount-dropdown/discount-dropdown.module";
import { GstTemplateAComponent } from "./template/gst-template-a/gst-template-a.component";
import { TemplatePreviewDialogComponent } from "./template-preview-dialog/template-preview-dialog.component";
import { TemplateEditDialogComponent } from "./template-edit-dialog/template-edit-dialog.component";
import { PrintVoucherComponent } from "./print-voucher/print-voucher.component";
import { GenericAsideMenuAccountModule } from "../shared/generic-aside-menu-account/generic.aside.menu.account.module";
import { KeyboardShortutModule } from "../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { TemplateEditFilterComponent } from "./template/template-edit-filter/template-edit-filter.component";
import { MatBadgeModule } from '@angular/material/badge';
import { DesignFilterComponent } from "./template/design-filter/design-filter.component";
import { ContentFilterComponent } from "./template/content-filter/content-filter.component";
import { CreateDiscountModule } from "../theme/create-discount/create-discount.module";
import { AsideMenuCreateTaxModule } from "../shared/aside-menu-create-tax/aside-menu-create-tax.module";
import { ConvertBillDialogComponent } from "./convert-bill-dialog/convert-bill-dialog.component";
import { MatDividerModule } from "@angular/material/divider";
import { AsideMenuProductServiceModule } from "../shared/aside-menu-product-service/aside-menu-product-service.module";
import { SendEmailInvoiceModule } from "../shared/send-email-invoice/send-email-invoice.module";
import { FullAddressComponent } from "./full-address/full-address.component";
import { ClickOutsideModule } from "ng-click-outside";
import { AmountFieldComponentModule } from "../shared/amount-field/amount-field.module";
import { EntryAmountModule } from "./utility/directives/entry-amount/entry-amount.module";
import { EntryTotalModule } from "./utility/directives/entry-total/entry-total.module";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { ReplacePipeModule } from "../shared/helpers/pipes/replace/replace.module";

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
        EmailSendDialogComponent,
        GstTemplateAComponent,
        TemplatePreviewDialogComponent,
        TemplateEditDialogComponent,
        PrintVoucherComponent,
        TemplateEditFilterComponent,
        DesignFilterComponent,
        ContentFilterComponent,
        ConvertBillDialogComponent,
        FullAddressComponent
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
        MatDialogModule,
        MatExpansionModule,
        WatchVideoModule,
        HamburgerMenuModule,
        ScrollingModule,
        NoDataModule,
        OtherTaxModule,
        AddBulkItemsModule,
        MatSlideToggleModule,
        TranslateDirectiveModule,
        VoucherNameModule,
        VoucherCopyLinkModule,
        MatProgressSpinnerModule,
        TaxDropdownModule,
        DiscountDropdownModule,
        GenericAsideMenuAccountModule,
        KeyboardShortutModule,
        MatBadgeModule,
        CreateDiscountModule,
        AsideMenuCreateTaxModule,
        MatDividerModule,
        AsideMenuProductServiceModule,
        SendEmailInvoiceModule,
        ClickOutsideModule,
        AmountFieldComponentModule,
        EntryAmountModule,
        EntryTotalModule,
        GiddhPageLoaderModule,
        ReplacePipeModule
    ],
    exports: [

    ]
})
export class VouchersModule {

}