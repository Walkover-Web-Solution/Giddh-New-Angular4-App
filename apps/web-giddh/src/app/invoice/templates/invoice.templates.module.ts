import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutTemplateComponent } from './edit-template/out-tempate/out.template.component';
import { ContentFilterComponent } from './edit-template/filters-container/content-filters/content.filters.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { GstTemplateAComponent } from './edit-template/out-tempate/templates/gst-template-a/gst-template-a.component';
import { GstTemplateEComponent } from './edit-template/out-tempate/templates/gst-template-e/gst-template-e.component';
import { HasFocusDirectiveModule } from '../../shared/helpers/directives/has-focus/has-focus.module';
import { ThermalTemplateComponent } from './edit-template/out-tempate/templates/thermal-template/thermal-template.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule.forRoot(),
        HasFocusDirectiveModule
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
        ContentFilterComponent
    ]
})
export class InvoiceTemplatesModule {
}
