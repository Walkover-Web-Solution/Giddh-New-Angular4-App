import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditInvoiceComponent } from './edit.invoice.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditInvoiceRoutingModule } from './edit.invoice.routing.module';

import { EditFiltersContainersComponent } from './edit.filters.component';
import { EditFiltersContainerRoutingModule } from './edit.filters.routing.module';
import { DesignFiltersContainerModule } from './design-filters/design.filters.module';
import { SharedModule } from '../../../shared/shared.module';
import { DesignFiltersContainerComponent } from './design-filters/design.filters.component';
import { SelectTemplateComponent } from './design-filters/select-template/select.template.component';
import { ContentFilterComponent } from './content-filters/content.filters.component';
import {NouisliderModule} from "ng2-nouislider";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NouisliderModule

  ],
  declarations: [DesignFiltersContainerComponent, SelectTemplateComponent],
  exports: [
    DesignFiltersContainerModule,
    DesignFiltersContainerComponent,
    SelectTemplateComponent,
    NouisliderModule

  ]
})
export class EditFiltersModule {
}
