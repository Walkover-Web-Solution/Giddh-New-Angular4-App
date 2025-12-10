import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxMaskModule } from '../../shared/helpers/directives/ngx-mask';
import { TaxControlComponent } from './tax-control.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";
// import { FormFieldsModule } from '../form-fields/form-fields.module';
// Temporarily disabled;

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NgxMaskModule.forRoot(),
        MatMenuModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule
    
    ],
    declarations: [
        TaxControlComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    exports: [
        TaxControlComponent
    ]
})

export class TaxControlModule { }
