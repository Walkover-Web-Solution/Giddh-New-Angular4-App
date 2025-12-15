import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
// import { ConfirmationModalModule } from "apps/web-giddh/src/app/theme/confirmation-modal/confirmation-modal.module";
// import { ConfirmModalModule } from "apps/web-giddh/src/app/theme";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { AccountUpdateNewDetailsComponent } from "./account-update-new-details.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
    declarations: [
        AccountUpdateNewDetailsComponent
    ],
    imports: [
        CommonModule,
        // FormFieldsModule,
        TranslateDirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        RouterModule,
        // ConfirmModalModule,
        // ConfirmationModalModule,
        MatButtonModule,
        MatRadioModule,
        MatTabsModule,
        // NewConfirmModalModule,
        MatTooltipModule,
        OverlayModule,
        // MobileNumberInputComponent
    ],
    exports: [
        AccountUpdateNewDetailsComponent,
        // ConfirmModalModule,
        // ConfirmationModalModule
    ],
    providers: [
        // SalesPersonService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AccountUpdateNewDetailsModule {

}
