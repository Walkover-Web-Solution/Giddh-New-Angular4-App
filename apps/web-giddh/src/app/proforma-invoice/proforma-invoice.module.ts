import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { BsDatepickerModule, BsDropdownModule, CollapseModule, ModalModule } from 'ngx-bootstrap';
import { NgxUploaderModule } from 'ngx-uploader';

import { SettingsServiceModule } from '../settings/settings-service.module';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic-aside-menu-account.module';
import { VoucherTypeToNamePipeModule } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { SharedModule } from '../shared/shared.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AsideMenuProductServiceComponent } from './components/aside-menu-product-service/component';
import {
    CreateAccountModalComponent,
} from './components/aside-menu-product-service/components/create-account-modal/create.account.modal';
import {
    CreateAccountServiceComponent,
} from './components/aside-menu-product-service/components/create-account-service/create.account.service';
import {
    SalesAddStockGroupComponent,
} from './components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal';
import {
    SalesAddStockComponent,
} from './components/aside-menu-product-service/components/create-stock/sales.create.stock.component';
import { ProformaAddBulkItemsComponent } from './components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { ProformaGstTreatmentComponent } from './components/proforma-gst-treatment/proforma-gst-treatment.component';
import { ProformaLastInvoicesComponent } from './components/proforma-last-invoices/proforma-last-invoices.component';
import { ProformaPrintInPlaceComponent } from './components/proforma-print-inplace/proforma-print-in-place.component';
import { ProformaInvoiceRendererComponent } from './proforma-invoice-renderer.component';
import { ProformaInvoiceComponent } from './proforma-invoice.component';
import { ProformaInvoiceRoutingModule } from './proforma-invoice.routing.module';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';


@NgModule({
    imports: [
        ProformaInvoiceRoutingModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ShSelectModule,
        KeyboardShortutModule,
        SalesShSelectModule,
        BsDatepickerModule,
        DecimalDigitsModule,
        // SalesModule,
        CollapseModule,
        NgxUploaderModule,
        BsDropdownModule,
        DigitsOnlyModule,
        SharedModule,
        AsideMenuRecurringEntryModule,
        ModalModule,
        TaxControlModule,
        DiscountControlModule,
        GenericAsideMenuAccountModule,
        LaddaModule,
        SelectModule.forRoot(),
        SendEmailInvoiceModule,
        VoucherTypeToNamePipeModule,
        PdfJsViewerModule,
        CurrencyModule,
        NgxMaskModule.forRoot(),
        SettingsServiceModule,
        AdvanceReceiptAdjustmentModule
    ],
    exports: [ProformaInvoiceComponent, SalesAddStockComponent, SalesAddStockGroupComponent, AsideMenuProductServiceComponent, ProformaAddBulkItemsComponent],
    declarations: [
        ProformaInvoiceRendererComponent,
        ProformaInvoiceComponent,
        ProformaAddBulkItemsComponent,
        ProformaLastInvoicesComponent,
        ProformaGstTreatmentComponent,
        SalesAddStockComponent,
        SalesAddStockGroupComponent,
        CreateAccountModalComponent,
        CreateAccountServiceComponent,
        AsideMenuProductServiceComponent,
        ProformaPrintInPlaceComponent
    ],
    providers: [],
})
export class ProformaInvoiceModule {
}
