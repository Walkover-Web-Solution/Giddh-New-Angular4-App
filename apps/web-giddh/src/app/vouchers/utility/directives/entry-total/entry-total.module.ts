import { NgModule } from "@angular/core";
import { EntryTotalDirective } from "./entry-total.directive";

@NgModule({
    declarations: [
        EntryTotalDirective
    ],
    exports: [
        EntryTotalDirective
    ]
})
export class EntryTotalModule {

}