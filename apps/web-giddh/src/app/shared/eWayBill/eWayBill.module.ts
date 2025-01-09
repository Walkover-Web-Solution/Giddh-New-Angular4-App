import { NgModule } from '@angular/core';
import { EWayBillCreateComponent } from './create/eWayBill.create.component';
import { EWayBillComponent } from './eWayBill/eWayBill.component';
import { EWayBillCredentialsComponent } from './eWayBillcredentialsModal/eWayBillCredentials.component';
import { TranslateModule } from '@ngx-translate/core';
import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
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
        TranslateModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        MatFormFieldModule,
        CommonModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        LaddaModule,
        ModalModule.forRoot(),
        DeleteTemplateConfirmationModalModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatInputModule,
        MatRadioModule,
        GiddhDatepickerModule,
        MatDialogModule,
        MatButtonModule,
    ],
    exports: [
        EWayBillComponent,
        EWayBillCreateComponent,
        EWayBillCredentialsComponent
    ]
})
export class EWayBillComponentModule {
}
