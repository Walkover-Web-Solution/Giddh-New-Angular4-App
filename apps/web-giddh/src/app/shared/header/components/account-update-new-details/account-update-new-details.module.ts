import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LaddaModule } from "angular2-ladda";
import { ConfirmationModalModule } from "apps/web-giddh/src/app/theme/confirmation-modal/confirmation-modal.module";
import { ConfirmModalModule } from "apps/web-giddh/src/app/theme";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { AccountUpdateNewDetailsComponent } from "./account-update-new-details.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormFieldsModule } from "apps/web-giddh/src/app/theme/form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";

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
        ModalModule.forRoot(),
        ConfirmModalModule,
        ConfirmationModalModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        MatButtonModule,
        MatRadioModule,
        MatTabsModule
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
