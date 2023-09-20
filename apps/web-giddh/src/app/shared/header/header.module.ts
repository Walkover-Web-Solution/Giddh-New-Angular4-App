import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { RouterModule } from "@angular/router";
import { LaddaModule } from "angular2-ladda";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ConfirmModalModule } from "../../theme/confirm-modal/confirm-modal.module";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { DatepickerWrapperModule } from "../datepicker-wrapper/datepicker.wrapper.module";
import { ElementViewChildModule } from "../helpers/directives/elementViewChild/elementViewChild.module";
import { PrimarySidebarModule } from "../primary-sidebar/primary-sidebar.module";
import { AsideHelpSupportComponent } from "./components/aside-help-support/aside-help-support.component";
import { AsideSettingComponent } from "./components/aside-setting/aside-setting.component";
import { HeaderComponent } from "./header.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
    declarations: [
        HeaderComponent,
        AsideSettingComponent,
        AsideHelpSupportComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        ModalModule.forRoot(),
        ElementViewChildModule,
        ScrollingModule,
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
        RouterModule,
        MatDialogModule,
        MatListModule,
        MatButtonModule,
        MatTreeModule,
        MatMenuModule,
        MatDialogModule,
        MatListModule
    ],
    exports: [
        HeaderComponent,
        AsideSettingComponent
    ]
})

export class HeaderModule {

}
