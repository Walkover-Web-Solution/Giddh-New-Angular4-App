import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { InvoiceComponent } from './invoice.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceGenerateComponent } from './generate/invoice.generate.component';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';
// import { InvoiceCreateComponent } from './create/invoice.create.component';
import { InvoiceTemplatesModule } from './templates/invoice.templates.module';
import { EditInvoiceComponent } from './templates/edit-template/edit.invoice.component';
import { InvoiceSettingComponent } from './settings/invoice.settings.component';

import { FontPickerModule } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';
import { NgUploaderModule } from 'ngx-uploader';
import { DesignFiltersContainerComponent } from './templates/edit-template/filters-container/design-filters/design.filters.component';
import { EditFiltersContainersComponent } from './templates/edit-template/filters-container/edit.filters.component';
import { InvoiceUiDataService } from '../services/invoice.ui.data.service';

const FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  apiKey: 'AIzaSyAPcvNvidnjQL-a_2xW2QYox3hT7DQBWyo'
};
import { DeleteInvoiceConfirmationModelComponent } from './preview/models/confirmation/confirmation.model.component';
import { PerformActionOnInvoiceModelComponent } from './preview/models/perform_action/invoice.action.model.component';
import { InvoiceGenerateModelComponent } from './generate/model/invoice.generate.model.component';

const INVOICE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [NeedsAuthentication],
    component: InvoiceComponent,
    children: [
      { path: 'preview',  component: InvoicePreviewComponent  },
      { path: 'generate',  component: InvoiceGenerateComponent },
      { path: 'templates',  component: EditInvoiceComponent },
      { path: 'settings', component: InvoiceSettingComponent },
    ]
  }
];

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoicePreviewComponent,
    InvoiceGenerateComponent,
    EditInvoiceComponent,
    // InvoiceCreateComponent,
    DesignFiltersContainerComponent,
    EditFiltersContainersComponent,
    InvoiceSettingComponent,
    DeleteInvoiceConfirmationModelComponent,
    PerformActionOnInvoiceModelComponent,
    InvoiceGenerateModelComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(INVOICE_ROUTES),
    TooltipModule.forRoot(),
    InvoiceTemplatesModule,
    FontPickerModule.forRoot(FONT_PICKER_CONFIG),
    NgUploaderModule
  ],
  exports: [
    RouterModule,
    TooltipModule
  ],
  providers: [InvoiceUiDataService]
})
export class InvoiceRoutingModule { }
