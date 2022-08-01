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
import { CompanyAddNewUiComponent } from "./components/company-add-new-ui/company-add-new-ui.component";
import { HeaderComponent } from "./header.component";

@NgModule({
    declarations: [
        HeaderComponent,
        CompanyAddNewUiComponent
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
        TooltipModule,
        BsDropdownModule,
        DatepickerWrapperModule,
        ShSelectModule,
        LaddaModule,
        ConfirmModalModule,
        RouterModule
    ],
    exports: [
        HeaderComponent,
        CompanyAddNewUiComponent
    ],
    entryComponents: [
        CompanyAddNewUiComponent
    ]
})

export class HeaderModule {

}