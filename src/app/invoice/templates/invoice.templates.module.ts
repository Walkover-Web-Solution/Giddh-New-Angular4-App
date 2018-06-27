import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { GstTemplateAComponent } from './edit-template/out-tempate/templates/gst-template-a/gst-template-a.component';
// import { GstTemplateBComponent } from './edit-template/out-tempate/templates/gst-template-b/gst-template-b.component';
import { GstTemplateEComponent } from './edit-template/out-tempate/templates/gst-template-e/gst-template-e.component';
import { GstTemplateDComponent } from './edit-template/out-tempate/templates/gst-template-d/gst-template-d.component';
import { GstTemplateBComponent } from './edit-template/out-tempate/templates/gst-template-b/gst-template-b.component';
import { GstTemplateCComponent } from './edit-template/out-tempate/templates/gst-template-c/gst-template-c.component';

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
    // GstTemplateBComponent,
    GstTemplateEComponent,
    GstTemplateDComponent,
    GstTemplateBComponent,
    GstTemplateCComponent
  ],
  exports: [
    OutTemplateComponent,
    ContentFilterComponent,
]})
export class InvoiceTemplatesModule {}
