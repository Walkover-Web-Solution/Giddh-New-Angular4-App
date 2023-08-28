import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateUpdateGroupComponent } from "./create-update-group.component";
import { MainGroupComponent } from "./main-group.component";
import { PageLeaveConfirmationGuard } from "../../../decorators/page-leave-confirmation-guard";

const routes: Routes = [
    {
        path: "",
        component: MainGroupComponent,
        children: [
            {
                path: ":type/create",
                component: CreateUpdateGroupComponent,
                pathMatch: 'full',
                canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: ":type/edit/:groupUniqueName",
                component: CreateUpdateGroupComponent,
                pathMatch: 'full',
                canDeactivate: [PageLeaveConfirmationGuard]
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GroupCreateEditRoutingModule {
}
