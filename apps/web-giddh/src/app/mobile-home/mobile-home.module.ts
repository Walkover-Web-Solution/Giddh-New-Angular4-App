import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { MobileHomeComponent } from "./home/home.component";
import { MainComponent } from "./main.component";
import { MobileHomeSidebarComponent } from "./sidebar/sidebar.component";
import { MobileHomeRoutingModule } from "./mobile-home.routing.module";
import { MobileSearchBranchComponent } from "./search-branch/search-branch.component";
import { MobileSearchCompanyComponent } from "./search-company/search-company.component";

@NgModule({
    declarations: [
        MainComponent,
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
    ]
})

export class MobileHomeModule {

}