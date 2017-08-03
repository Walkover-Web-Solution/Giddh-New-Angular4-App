import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditInvoiceComponent } from './edit.invoice.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditInvoiceRoutingModule } from './edit.invoice.routing.module';

import { EditFiltersModule } from './filters-container/edit.filters.module';
import { SharedModule } from '../../shared/shared.module';
import { OutTemplateComponent } from './out-tempate/out.template.component';
import { EditFiltersContainersComponent } from './filters-container/edit.filters.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EditFiltersModule
  ],
  declarations: [EditInvoiceComponent, OutTemplateComponent, EditFiltersContainersComponent],
  exports: [
    EditFiltersModule,
    EditInvoiceComponent
  ]
})
export class EditInvoiceModule {
}
