import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AddCompanyComponent } from "./add-company.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AddCompanyComponent }
        ])
    ],
    exports: [RouterModule]
})
export class AddCompanyRoutingModule {
}
