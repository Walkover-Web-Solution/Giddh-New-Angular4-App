import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LaddaModule } from "angular2-ladda";
import { ConfirmationModalModule } from "apps/web-giddh/src/app/common/confirmation-modal/confirmation-modal.module";
import { ConfirmModalModule } from "apps/web-giddh/src/app/theme";
import { SelectModule } from "apps/web-giddh/src/app/theme/ng-select/ng-select";
import { ShSelectModule } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "apps/web-giddh/src/app/theme/translate/translate.directive.module";
import { NgxBootstrapSwitchModule } from "ngx-bootstrap-switch";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TabsModule } from "ngx-bootstrap/tabs";
import { AccountUpdateNewDetailsComponent } from "./account-update-new-details.component";
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
    declarations: [
        AccountUpdateNewDetailsComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ShSelectModule,
        TabsModule.forRoot(),
        NgxBootstrapSwitchModule.forRoot(),
        RouterModule,
        ModalModule,
        ConfirmModalModule,
        ConfirmationModalModule,
        NgxIntlTelInputModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        PopoverModule.forRoot()
    ],
    exports: [
        AccountUpdateNewDetailsComponent,
        ModalModule,
        ConfirmModalModule,
        ConfirmationModalModule
    ],
    entryComponents: [
        AccountUpdateNewDetailsComponent
    ]
})

export class AccountUpdateNewDetailsModule {

}