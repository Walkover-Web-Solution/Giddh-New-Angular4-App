import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgxDaterangepickerMd } from "../../theme/ngx-date-range-picker";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { ElementViewChildModule } from "../helpers/directives/elementViewChild/elementViewChild.module";
import { PrimarySidebarModule } from "../primary-sidebar/primary-sidebar.module";
import { HeaderComponent } from "./header.component";

@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        NgxDaterangepickerMd,
        ModalModule,
        ElementViewChildModule,
        PerfectScrollbarModule,
        PrimarySidebarModule,
        TooltipModule,
        BsDropdownModule
    ],
    exports: [
        HeaderComponent
    ]
})

export class HeaderModule {

}