import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { LaddaModule } from "angular2-ladda";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ConfirmModalModule } from "../../theme/confirm-modal/confirm-modal.module";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { DatepickerWrapperModule } from "../datepicker-wrapper/datepicker.wrapper.module";
import { ElementViewChildModule } from "../helpers/directives/elementViewChild/elementViewChild.module";
import { PrimarySidebarModule } from "../primary-sidebar/primary-sidebar.module";
import { AsideHelpSupportComponent } from "./components/aside-help-support/aside-help-support.component";
import { AsideSettingComponent } from "./components/aside-setting/aside-setting.component";
import { CompanyAddNewUiComponent } from "./components/company-add-new-ui/company-add-new-ui.component";
import { HeaderComponent } from "./header.component";

@NgModule({
    declarations: [
        HeaderComponent,
        CompanyAddNewUiComponent,
        AsideSettingComponent,
        AsideHelpSupportComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        ModalModule,
        ElementViewChildModule,
        PerfectScrollbarModule,
        PrimarySidebarModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        DatepickerWrapperModule,
        ShSelectModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ConfirmModalModule,
        RouterModule
    ],
    exports: [
        HeaderComponent,
        CompanyAddNewUiComponent,
        AsideSettingComponent
    ]
})

export class HeaderModule {

}