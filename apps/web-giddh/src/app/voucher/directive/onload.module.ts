import { NgModule } from "@angular/core";
import { OnloadDirective } from "./onload.directive";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        OnloadDirective
    ],
    exports: [
        OnloadDirective
    ]
})
/**
 * OnloadDirectiveModule module
 * Implements OnloadDirectiveModule functionality
 */
export class OnloadDirectiveModule {
    
}