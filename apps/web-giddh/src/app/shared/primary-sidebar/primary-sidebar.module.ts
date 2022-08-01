import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CheckPermissionModule } from "../../permissions/check-permission.module";
import { CommandKModule } from "../../theme/command-k/command.k.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { CompanyBranchComponent } from "./company-branch/company-branch.component";
import { PrimarySidebarComponent } from "./primary-sidebar.component";

@NgModule({
    declarations: [
        PrimarySidebarComponent,
        CompanyBranchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        ClickOutsideModule,
        BsDropdownModule,
        TooltipModule,
        RouterModule,
        CheckPermissionModule,
        CommandKModule,
        TabsModule
    ],
    exports: [
        PrimarySidebarComponent
    ]
})

export class PrimarySidebarModule {
    
}