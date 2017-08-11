import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { InvoiceComponent } from './invoice.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceGenerateComponent } from './generate/invoice.generate.component';
import { InvoiceTemplatesComponent } from './templates/invoice.templates.component';
import { InvoiceSettingsComponent } from './settings/invoice.settings.component';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';

const INVOICE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [NeedsAuthentication],
    component: InvoiceComponent,
    children: [
      { path: 'preview',  component: InvoicePreviewComponent  },
      { path: 'generate',  component: InvoiceGenerateComponent },
      { path: 'templates',  component: InvoiceTemplatesComponent  },
      { path: 'settings',  component: InvoiceSettingsComponent  }
    ]
  }
];

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoicePreviewComponent,
    InvoiceGenerateComponent,
    InvoiceTemplatesComponent,
    InvoiceSettingsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(INVOICE_ROUTES)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class InvoiceRoutingModule { }
