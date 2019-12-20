import { NgModule } from '@angular/core';
import { ProformaInvoiceComponent } from './proforma-invoice.component';
import { ProformaInvoiceRoutingModule } from './proforma-invoice.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { BsDatepickerModule, BsDropdownModule, CollapseModule, ModalModule } from 'ngx-bootstrap';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { SharedModule } from '../shared/shared.module';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { ProformaAddBulkItemsComponent } from './components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { ProformaLastInvoicesComponent } from './components/proforma-last-invoices/proforma-last-invoices.component';
import { ProformaGstTreatmentComponent } from './components/proforma-gst-treatment/proforma-gst-treatment.component';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { ProformaInvoiceRendererComponent } from './proforma-invoice-renderer.component';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic-aside-menu-account.module';
import { SalesAddStockComponent } from './components/aside-menu-product-service/components/create-stock/sales.create.stock.component';
import { SalesAddStockGroupComponent } from './components/aside-menu-product-service/components/create-stock-group-modal/create.stock.group.modal';
import { CreateAccountModalComponent } from './components/aside-menu-product-service/components/create-account-modal/create.account.modal';
import { CreateAccountServiceComponent } from './components/aside-menu-product-service/components/create-account-service/create.account.service';
import { AsideMenuProductServiceComponent } from './components/aside-menu-product-service/component';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from '../theme/ng-select/ng-select';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { VoucherTypeToNamePipeModule } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
import { ProformaPrintInPlaceComponent } from './components/proforma-print-inplace/proforma-print-in-place.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import {CurrencyModule} from "../shared/helpers/pipes/currencyPipe/currencyType.module";
import {NgxMaskModule} from "../shared/helpers/directives/ngx-mask";


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
    NgxMaskModule.forRoot()
  ],
  exports: [ProformaInvoiceComponent, SalesAddStockComponent, SalesAddStockGroupComponent, AsideMenuProductServiceComponent],
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
