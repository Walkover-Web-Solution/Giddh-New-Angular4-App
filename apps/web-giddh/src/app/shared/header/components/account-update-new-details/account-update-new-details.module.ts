import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmationModalModule } from "apps/web-giddh/src/app/theme/confirmation-modal/confirmation-modal.module";
import { ConfirmModalModule } from "apps/web-giddh/src/app/theme";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { AccountUpdateNewDetailsComponent } from "./account-update-new-details.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
// import { FormFieldsModule } from "apps/web-giddh/src/app/theme/form-fields/form-fields.module";
// Temporarily disabled;
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { NewConfirmModalModule } from "apps/web-giddh/src/app/theme/new-confirm-modal";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SalesPersonService } from "../../../sales-person/utility/sales-person.service";
import { OverlayModule } from "@angular/cdk/overlay";
import { MobileNumberInputComponent } from "../../../mobile-number-input";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        AccountUpdateNewDetailsComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        RouterModule,
        ConfirmModalModule,
        ConfirmationModalModule,
        MatButtonModule,
        MatRadioModule,
        MatTabsModule,
        NewConfirmModalModule,
        MatTooltipModule,
        OverlayModule,
        MobileNumberInputComponent
    ],
    exports: [
        AccountUpdateNewDetailsComponent,
        ConfirmModalModule,
        ConfirmationModalModule
    
    ],
    providers: [
        SalesPersonService
    ]
})

export class AccountUpdateNewDetailsModule {

}
