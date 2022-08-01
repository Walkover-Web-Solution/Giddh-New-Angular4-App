import { NgModule } from "@angular/core";
import { CheckPermissionDirective } from "./check-permission.directive";

@NgModule({
    declarations: [
        CheckPermissionDirective
    ],
    exports: [
        CheckPermissionDirective
    ]
})

export class CheckPermissionModule {
    
}