import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { VoucherListComponent } from "./list/list.component";
import { VouchersPreviewComponent } from "./preview/preview.component";
import { VoucherCreateComponent } from "./create/create.component";
import { PageLeaveConfirmationGuard } from "../decorators/page-leave-confirmation-guard";

const routes: Routes = [
    {
        path: "", 
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path: ":voucherType/list",
                component: VoucherListComponent
            },
            {
                path: ":voucherType/preview",
                component: VouchersPreviewComponent
            },
            {
                path: ":voucherType/create",
                component: VoucherCreateComponent,
                canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: ":voucherType/:accountUniqueName/create",
                component: VoucherCreateComponent
            },
            {
                path: ":voucherType/:accountUniqueName/:uniqueName/edit",
                component: VoucherCreateComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VouchersRoutingModule {
}