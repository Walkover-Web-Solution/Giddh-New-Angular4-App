import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MobileHomeComponent } from "./home/home.component";
import { MainComponent } from "./main.component";
import { MobileSearchBranchComponent } from "./search-branch/search-branch.component";
import { MobileSearchCompanyComponent } from "./search-company/search-company.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            },
            {
                path: "home",
                component: MobileHomeComponent
            },
            {
                path: "search-company",
                component: MobileSearchCompanyComponent
            },
            {
                path: "search-branch",
                component: MobileSearchBranchComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MobileHomeRoutingModule {

}