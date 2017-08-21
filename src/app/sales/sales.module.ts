import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesComponent } from './sales.component';
import { InvoiceCreateComponent } from './create/invoice.create.component';

@NgModule({
  declarations: [
    SalesComponent,
    InvoiceCreateComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TooltipModule.forRoot()
  ],
  exports: [
    TooltipModule
  ],
  providers: []
})
export class SalesModule {}
