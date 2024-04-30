import { NgModule } from "@angular/core";
import { EntryAmountDirective } from "./entry-amount.directive";

@NgModule({
    declarations: [
        EntryAmountDirective
    ],
    exports: [
        EntryAmountDirective
    ]
})
export class EntryAmountModule {

}