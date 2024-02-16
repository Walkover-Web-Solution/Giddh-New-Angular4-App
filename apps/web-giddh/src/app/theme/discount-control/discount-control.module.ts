import { NgModule } from '@angular/core';
import { DiscountControlComponent } from './discount-control.component';
import { DecimalDigitsModule } from '../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxMaskModule } from "../../shared/helpers/directives/ngx-mask";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormFieldsModule } from '../form-fields/form-fields.module';

@NgModule({
    imports: [
        DecimalDigitsModule,
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NgxMaskModule.forRoot(),
        MatCheckboxModule,
        FormFieldsModule
    ],
    exports: [
        DiscountControlComponent
    ],
    declarations: [DiscountControlComponent],
    providers: [],
})
export class DiscountControlModule {
}
