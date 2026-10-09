import { NgModule } from "@angular/core";
import { CheckPermissionDirective } from "./check-permission.directive";
import { PermissionDataService } from "./permission-data.service";

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

export class CheckPermissionModule {

}
