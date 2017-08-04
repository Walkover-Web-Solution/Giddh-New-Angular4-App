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
import { SelectLogoComponent } from './design-filters/select-logo/select.logo.component';
import { ContentFilterComponent } from './content-filters/content.filters.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [DesignFiltersContainerComponent, SelectTemplateComponent, SelectLogoComponent, ContentFilterComponent],
  exports: [
    DesignFiltersContainerModule,
    DesignFiltersContainerComponent,
    SelectTemplateComponent,
    SelectLogoComponent,
    ContentFilterComponent
  ]
})
export class EditFiltersModule {
}
