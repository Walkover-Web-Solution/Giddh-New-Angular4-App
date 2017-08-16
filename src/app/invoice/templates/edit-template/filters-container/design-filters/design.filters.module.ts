import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditInvoiceComponent } from './edit.invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditInvoiceRoutingModule } from './edit.invoice.routing.module';
import { OutTempalteComponent } from './out-tempate/out.template.component';
import { EditFiltersContainersComponent } from './edit.filters.component';
import { EditFiltersContainerRoutingModule } from './edit.filters.routing.module';
import { DesignFiltersContainerComponent } from './design.filters.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { SelectTemplateComponent } from './select-template/select.template.component';
import { Actions } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [],
  exports: [

]
})
export class DesignFiltersContainerModule {
}
