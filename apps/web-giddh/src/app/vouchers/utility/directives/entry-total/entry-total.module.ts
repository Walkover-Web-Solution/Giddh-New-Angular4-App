import { NgModule } from "@angular/core";
import { EntryTotalDirective } from "./entry-total.directive";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        EntryTotalDirective
    ],
    exports: [
        EntryTotalDirective
    ]
})
/**
 * EntryTotalModule module
 * Implements EntryTotalModule functionality
 */
export class EntryTotalModule {

}