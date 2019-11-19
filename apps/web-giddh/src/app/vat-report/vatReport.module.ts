import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VatReportRoutingModule } from './vatReport.routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { VatReportComponent } from './vatReport.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    VatReportComponent
  ],
  imports: [
    VatReportRoutingModule,
    TabsModule,
    CommonModule,
    TooltipModule
  ],
  exports: [
    VatReportRoutingModule
  ]
})
export class VarReportModule {
}
// InvoiceModule
