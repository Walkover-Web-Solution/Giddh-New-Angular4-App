import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EditInvoiceComponent } from './edit-template/edit.invoice.component';
import { EditFiltersContainersComponent } from './edit-template/filters-container/edit.filters.component';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CollapseModule,
  ],
  declarations: [ OutTemplateComponent, ContentFilterComponent ],
  exports: [
    OutTemplateComponent,
    ContentFilterComponent,
]})
export class InvoiceTemplatesModule {}
