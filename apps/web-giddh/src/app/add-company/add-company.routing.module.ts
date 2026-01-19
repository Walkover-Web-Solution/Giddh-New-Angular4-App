import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AddCompanyComponent } from "./add-company.component";
import { PageLeaveConfirmationGuard } from "../decorators/page-leave-confirmation-guard";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AddCompanyComponent, canDeactivate: [PageLeaveConfirmationGuard] }
        ])
    ],
    exports: [RouterModule]
})
/**
 * AddCompanyRoutingModule module
 * Implements AddCompanyRoutingModule functionality
 */
export class AddCompanyRoutingModule {
}
