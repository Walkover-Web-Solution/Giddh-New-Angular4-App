import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { GstTemplateAComponent } from './edit-template/out-tempate/templates/gst-template-a/gst-template-a.component';
import { GstTemplateBComponent } from './edit-template/out-tempate/templates/gst-template-b/gst-template-b.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule,
  ],
  declarations: [
    OutTemplateComponent,
    ContentFilterComponent,
    GstTemplateAComponent,
    GstTemplateBComponent
  ],
  exports: [
    OutTemplateComponent,
    ContentFilterComponent,
]})
export class InvoiceTemplatesModule {}
