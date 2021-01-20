import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Route, RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { MobileHomeSidebarComponent } from "./mobile-home-sidebar/mobile-home-sidebar.component";
import { MobileHomeComponent } from "./mobile-home.component";
import { MobileSearchBranchComponent } from "./mobile-search-branch/mobile-search-branch.component";
import { MobileSearchCompanyComponent } from "./mobile-search-company/mobile-search-company.component";

const routes: Array<Route> = [
    { path: '', component: MobileHomeComponent }
]

@NgModule({
    declarations: [
        MobileHomeComponent,
        MobileHomeSidebarComponent,
        MobileSearchCompanyComponent,
        MobileSearchBranchComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        BsDropdownModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MobileHomeModule {}