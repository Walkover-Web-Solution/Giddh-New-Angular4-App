import { NgModule } from '@angular/core';
import { TooltipModule, TypeaheadModule, CollapseModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesComponent } from './sales.component';
import { SalesInvoiceComponent } from './create/sales.invoice.component';
import { AsideMenuAccountComponent } from './aside-menu/aside.menu.account.component';

@NgModule({
  declarations: [
    SalesComponent,
    SalesInvoiceComponent,
    AsideMenuAccountComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    CollapseModule.forRoot()
  ],
  exports: [
    TooltipModule
  ],
  providers: []
})
export class SalesModule {}
