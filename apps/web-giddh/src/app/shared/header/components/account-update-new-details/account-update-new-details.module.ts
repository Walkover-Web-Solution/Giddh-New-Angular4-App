import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmationModalModule } from "apps/web-giddh/src/app/theme/confirmation-modal/confirmation-modal.module";
import { ConfirmModalModule } from "apps/web-giddh/src/app/theme";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { AccountUpdateNewDetailsComponent } from "./account-update-new-details.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormFieldsModule } from "apps/web-giddh/src/app/theme/form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { NewConfirmModalModule } from "apps/web-giddh/src/app/theme/new-confirm-modal";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SalesPersonService } from "../../../sales-person/utility/sales-person.service";
import { OverlayModule } from "@angular/cdk/overlay";
import { MobileNumberInputComponent } from "../../../mobile-number-input";
import { A11yModule } from "@angular/cdk/a11y";
import { KeyboardNavigationModule } from "../../../helpers/directives/enter-next/keyboard-navigation.module";

@NgModule({
    declarations: [
        AccountUpdateNewDetailsComponent
    ],
    imports: [
        CommonModule,
        FormFieldsModule,
        TranslateDirectiveModule,
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
        MobileNumberInputComponent,
        A11yModule,
        KeyboardNavigationModule
    ],
    exports: [
        AccountUpdateNewDetailsComponent,
        ConfirmModalModule,
        ConfirmationModalModule
    ],
    providers: [SalesPersonService]
})

export class AccountUpdateNewDetailsModule {

}
