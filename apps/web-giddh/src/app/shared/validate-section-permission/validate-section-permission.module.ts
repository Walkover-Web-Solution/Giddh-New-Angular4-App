import { NgModule } from "@angular/core";
import { ValidateSectionPermissionDirective } from "./validate-section-permission.directive";

@NgModule({
    declarations: [ValidateSectionPermissionDirective],
    exports: [ValidateSectionPermissionDirective]
})
export class ValidateSectionPermissionDirectiveModule { }
