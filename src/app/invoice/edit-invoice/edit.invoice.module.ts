import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditInvoiceComponent } from './edit.invoice.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditInvoiceRoutingModule } from './edit.invoice.routing.module';

import { EditFiltersModule } from './filters-container/edit.filters.module';
import { SharedModule } from '../../shared/shared.module';

import { EditFiltersContainersComponent } from './filters-container/edit.filters.component';
import { OutTemplateComponent } from './out-tempate/out.template.component';
import {MaterialModule, MdSliderModule} from "@angular/material";
import {ContentFilterComponent} from "./filters-container/content-filters/content.filters.component";
import {InvoiceRoutingModule} from "./edit-invoice.routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EditFiltersModule,
    InvoiceRoutingModule
  ],
  declarations: [ OutTemplateComponent, EditFiltersContainersComponent, ContentFilterComponent, EditInvoiceComponent],
  exports: [
    EditFiltersModule,
    OutTemplateComponent,
    ContentFilterComponent,
    EditInvoiceComponent
  ]
})
export class EditInvoiceModule {
}
