import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EditInvoiceComponent } from './edit-template/edit.invoice.component';
import { EditFiltersModule } from './edit-template/filters-container/edit.filters.module';
import { EditFiltersContainersComponent } from './edit-template/filters-container/edit.filters.component';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';
import { PrintSettingsComponent } from './edit-template/filters-container/design-filters/select-print-settings/print.settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    EditFiltersModule
  ],
  declarations: [ OutTemplateComponent, EditFiltersContainersComponent, ContentFilterComponent, EditInvoiceComponent],
  exports: [
    EditFiltersModule,
    OutTemplateComponent,
    ContentFilterComponent,
    EditInvoiceComponent
  ]
})
export class InvoiceTemplatesModule {}
