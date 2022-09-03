import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NeedsAuthentication } from "../decorators/needsAuthentication";
import { ImportsComponent } from "./imports/imports.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: ImportsComponent
            }
        ])
    ],
    exports: [RouterModule]
})

export class ImportsRoutingModule {

}
