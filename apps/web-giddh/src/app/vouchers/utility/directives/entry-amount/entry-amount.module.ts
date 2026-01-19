import { NgModule } from "@angular/core";
import { EntryAmountDirective } from "./entry-amount.directive";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        EntryAmountDirective
    ],
    exports: [
        EntryAmountDirective
    ]
})
/**
 * EntryAmountModule module
 * Implements EntryAmountModule functionality
 */
export class EntryAmountModule {

}