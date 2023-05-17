import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { GstTemplateAComponent } from './edit-template/out-tempate/templates/gst-template-a/gst-template-a.component';
import { GstTemplateEComponent } from './edit-template/out-tempate/templates/gst-template-e/gst-template-e.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { HasFocusDirectiveModule } from '../../shared/helpers/directives/has-focus/has-focus.module';
import { ThermalTemplateComponent } from './edit-template/out-tempate/templates/thermal-template/thermal-template.component';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule,
        NgxUploaderModule,
        HasFocusDirectiveModule,
        FormFieldsModule,
        MatCheckboxModule
    ],
    declarations: [
        OutTemplateComponent,
        ContentFilterComponent,
        GstTemplateAComponent,
        GstTemplateEComponent,
        ThermalTemplateComponent
    ],
    exports: [
        OutTemplateComponent,
        ContentFilterComponent,
    ]
})
export class InvoiceTemplatesModule {
}
