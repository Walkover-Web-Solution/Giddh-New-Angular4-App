import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { DecimalDigitsModule } from "../../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { DigitsOnlyModule } from "../../../shared/helpers/directives/digitsOnly/digitsOnly.module";
import { ShSelectModule } from "../../../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { AccountCreateEditComponent } from "./icici/account-create-edit/account-create-edit.component";
import { PayorCreateEditComponent } from "./icici/payor-create-edit/payor-create-edit.component";

@NgModule({
    declarations: [
        AccountCreateEditComponent,
        PayorCreateEditComponent
    ],
    imports: [
        ShSelectModule,
        ReactiveFormsModule,
        DigitsOnlyModule,
        CommonModule,
        TranslateDirectiveModule,
        DecimalDigitsModule,
        GiddhPageLoaderModule
    ],
    exports: [
        AccountCreateEditComponent,
        PayorCreateEditComponent
    ]
})

export class SettingIntegrationPaymentModule {
    
}