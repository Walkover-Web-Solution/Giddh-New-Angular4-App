import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditInvoiceComponent } from './edit.invoice.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditInvoiceRoutingModule } from './edit.invoice.routing.module';
import { OutTempalteComponent } from './out-tempate/out.template.component';
import { EditFiltersContainersComponent } from './edit.filters.component';
import { EditFiltersContainerRoutingModule } from './edit.filters.routing.module';
import { DesignFiltersContainerModule } from './design-filters/design.filters.module';
import { SharedModule } from '../../../shared/shared.module';
import { DesignFiltersContainerComponent } from './design-filters/design.filters.component';
import {SelectTemplateComponent} from "./design-filters/select-template/select.template.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [DesignFiltersContainerComponent, SelectTemplateComponent],
  exports: [
    DesignFiltersContainerModule,
    DesignFiltersContainerComponent,
    SelectTemplateComponent
  ]
})
export class EditFiltersModule {
}
