import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserAuthenticated } from "../decorators/UserAuthenticated";
import { PageComponent } from "./page.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PageComponent,
                canActivate: [UserAuthenticated]
            }
        ])
    ],
    exports: [RouterModule]
})

/**
 * PageRoutingModule module
 * Implements PageRoutingModule functionality
 */
export class PageRoutingModule {

}
