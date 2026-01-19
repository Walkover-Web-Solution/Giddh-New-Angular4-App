import { NgModule } from "@angular/core";
import { CheckPermissionDirective } from "./check-permission.directive";
import { PermissionDataService } from "./permission-data.service";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        CheckPermissionDirective
    ],
    providers: [
        PermissionDataService
    ],
    exports: [
        CheckPermissionDirective
    ]
})

/**
 * CheckPermissionModule module
 * Implements CheckPermissionModule functionality
 */
export class CheckPermissionModule {

}
