import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { BranchTransferComponent } from "./branch-transfer/branch-transfer.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: 'list'
            },
            {
                path: "list",
                component: BranchTransferComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BranchTransferRoutingModule {
}
