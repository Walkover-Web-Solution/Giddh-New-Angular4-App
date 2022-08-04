import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserAuthenticated } from "../decorators/UserAuthenticated";
import { PageComponent } from "./page.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: PageComponent, canActivate: [UserAuthenticated]
            }
        ])
    ]
})

export class PageRoutingModule {

}