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
import { GstTemplateFComponent } from './edit-template/out-tempate/templates/gst-template-f/gst-template-f.component';
import { GstTemplateGComponent } from './edit-template/out-tempate/templates/gst-template-g/gst-template-g.component';
import { GstTemplateHComponent } from './edit-template/out-tempate/templates/gst-template-h/gst-template-h.component';
import { GstTemplateIComponent } from './edit-template/out-tempate/templates/gst-template-i/gst-template-i.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { HasFocusDirectiveModule } from '../../shared/helpers/directives/has-focus/has-focus.module';
import { ThermalTemplateComponent } from './edit-template/out-tempate/templates/thermal-template/thermal-template.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule,
        NgxUploaderModule,
        HasFocusDirectiveModule
    ],
    declarations: [
        OutTemplateComponent,
        ContentFilterComponent,
        GstTemplateAComponent,
        GstTemplateEComponent,
        GstTemplateDComponent,
        GstTemplateFComponent,
        GstTemplateBComponent,
        GstTemplateCComponent,
        GstTemplateGComponent,
        GstTemplateHComponent,
        GstTemplateIComponent,
        ThermalTemplateComponent
    ],
    exports: [
        OutTemplateComponent,
        ContentFilterComponent,
    ]
})
export class InvoiceTemplatesModule {
}
