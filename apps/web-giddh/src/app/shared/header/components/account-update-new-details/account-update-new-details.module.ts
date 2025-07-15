import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ConfirmationModalModule } from "apps/web-giddh/src/app/theme/confirmation-modal/confirmation-modal.module";
import { ConfirmModalModule } from "apps/web-giddh/src/app/theme";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { AccountUpdateNewDetailsComponent } from "./account-update-new-details.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormFieldsModule } from "apps/web-giddh/src/app/theme/form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { NewConfirmModalModule } from "apps/web-giddh/src/app/theme/new-confirm-modal";
import { MatTooltipModule } from "@angular/material/tooltip";

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
        MatTooltipModule
    ],
    exports: [
        AccountUpdateNewDetailsComponent,
        ModalModule,
        ConfirmModalModule,
        ConfirmationModalModule
    ]
})

export class AccountUpdateNewDetailsModule {

}
