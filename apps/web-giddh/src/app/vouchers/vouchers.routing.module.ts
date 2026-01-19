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
                path: "view/:voucherType/:voucherUniqueName",
                component: VouchersPreviewComponent
            },
            {
                path: "preview/:voucherType/:module",
                component: VoucherListComponent
            },
            {
                path: ":voucherType/create",
                component: VoucherCreateComponent,
                canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: ":voucherType/:accountUniqueName/create",
                component: VoucherCreateComponent,
                canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: ":voucherType/:accountUniqueName/:uniqueName/:action",
                component: VoucherCreateComponent,
                canDeactivate: [PageLeaveConfirmationGuard]
            }
        ]
    }
];

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
/**
 * VouchersRoutingModule module
 * Implements VouchersRoutingModule functionality
 */
export class VouchersRoutingModule {
}