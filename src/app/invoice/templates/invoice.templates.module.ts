import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EditInvoiceComponent } from './edit-template/edit.invoice.component';
import { EditFiltersContainersComponent } from './edit-template/filters-container/edit.filters.component';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ OutTemplateComponent, ContentFilterComponent ],
  exports: [
    OutTemplateComponent,
    ContentFilterComponent,
]})
export class InvoiceTemplatesModule {}
