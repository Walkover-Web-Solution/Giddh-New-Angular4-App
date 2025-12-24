import { NgModule } from "@angular/core";
import { OnloadDirective } from "./onload.directive";

@NgModule({
    declarations: [
        OnloadDirective
    ],
    exports: [
        OnloadDirective
    ]
})
export class OnloadDirectiveModule {
    
}