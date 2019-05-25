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
import { SalesModule } from '../sales/sales.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { SharedModule } from '../shared/shared.module';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { ProformaAddBulkItemsComponent } from './components/proforma-add-bulk-items/proforma-add-bulk-items.component';
import { ProformaLastInvoicesComponent } from './components/proforma-last-invoices/proforma-last-invoices.component';
import { ProformaGstTreatmentComponent } from './components/proforma-gst-treatment/proforma-gst-treatment.component';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';


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
    SalesModule,
    CollapseModule,
    NgxUploaderModule,
    BsDropdownModule,
    DigitsOnlyModule,
    SharedModule,
    AsideMenuRecurringEntryModule,
    ModalModule,
    TaxControlModule,
    DiscountControlModule
  ],
  exports: [ProformaInvoiceComponent],
  declarations: [ProformaInvoiceComponent, ProformaAddBulkItemsComponent, ProformaLastInvoicesComponent, ProformaGstTreatmentComponent],
  providers: [],
})
export class ProformaInvoiceModule {
}
