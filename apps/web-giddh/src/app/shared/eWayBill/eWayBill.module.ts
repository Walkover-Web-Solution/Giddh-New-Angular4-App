import { NgModule } from '@angular/core';
import { EWayBillCreateComponent } from './create/e-way-bill-create-component';
import { EWayBillComponent } from './e-way-bill/e-way-bill-component';
import { EWayBillCredentialsComponent } from './e-way-bill-credentials-dialog/e-way-bill-credentials.component';
import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DeleteTemplateConfirmationModalModule } from '../../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [
        EWayBillComponent,
        EWayBillCreateComponent,
        EWayBillCredentialsComponent
    ],
    imports: [
        TranslateDirectiveModule,
        HamburgerMenuModule,
        MatFormFieldModule,
        CommonModule,
        FormsModule,
        LaddaModule,
        DeleteTemplateConfirmationModalModule,
        ReactiveFormsModule,
        GiddhDatepickerModule,
        FormFieldsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        EWayBillComponent,
        EWayBillCreateComponent,
        EWayBillCredentialsComponent
    ]
})
export class EWayBillModule { }