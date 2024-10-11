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
import { EditInvoiceComponent } from './edit-template/edit.invoice.component';
import { ValidateSectionPermissionDirectiveModule } from '../../shared/validate-section-permission/validate-section-permission.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InvoiceTemplateModalComponent } from './edit-template/modals/template-modal/template-modal.component';
import { EditFiltersContainersComponent } from './edit-template/filters-container/edit.filters.component';
import { DeleteTemplateConfirmationModalModule } from './edit-template/modals/confirmation-modal/confirmation.modal.module';
import { InvoiceTemplatePreviewModelComponent } from './edit-template/modals/template-preview-modal/template-preview.modal.component';
import { DesignFiltersContainerComponent } from './edit-template/filters-container/design-filters/design.filters.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { DecimalDigitsModule } from '../../shared/helpers/directives/decimalDigits/decimalDigits.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule.forRoot(),
        HasFocusDirectiveModule,
        BsDropdownModule,
        ModalModule,
        ClickOutsideModule,
        DecimalDigitsModule,
        ValidateSectionPermissionDirectiveModule,
        DeleteTemplateConfirmationModalModule
    ],
    declarations: [
        InvoiceTemplatePreviewModelComponent,
        DesignFiltersContainerComponent,
        OutTemplateComponent,
        ContentFilterComponent,
        GstTemplateAComponent,
        GstTemplateEComponent,
        ThermalTemplateComponent,
        EditInvoiceComponent,
        InvoiceTemplateModalComponent,
        EditFiltersContainersComponent
    ],
    exports: [
        OutTemplateComponent,
        ContentFilterComponent,
        EditInvoiceComponent
    ]
})
export class InvoiceTemplatesModule {
}
