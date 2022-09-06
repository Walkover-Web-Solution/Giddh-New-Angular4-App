import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { MobileHomeSidebarComponent } from "./mobile-home-sidebar/mobile-home-sidebar.component";
import { MobileHomeComponent } from "./mobile-home.component";
import { MobileHomeRoutingModule } from "./mobile-home.routing.module";
import { MobileSearchBranchComponent } from "./mobile-search-branch/mobile-search-branch.component";
import { MobileSearchCompanyComponent } from "./mobile-search-company/mobile-search-company.component";

@NgModule({
    declarations: [
        MobileHomeComponent,
        MobileHomeSidebarComponent,
        MobileSearchCompanyComponent,
        MobileSearchBranchComponent,
    ],
    imports: [
        CommonModule,
        MobileHomeRoutingModule,
        TranslateDirectiveModule,
        BsDropdownModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ClickOutsideModule
    ],
    exports: [
        
    ]
})

export class MobileHomeModule {

}