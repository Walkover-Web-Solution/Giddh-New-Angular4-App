import { NgModule } from "@angular/core";
import { MatchAddressDirective } from "./match-address.directive";

@NgModule({
    declarations: [
        MatchAddressDirective
    ],
    exports: [
        MatchAddressDirective
    ]
})
export class MatchAddressModule {

}