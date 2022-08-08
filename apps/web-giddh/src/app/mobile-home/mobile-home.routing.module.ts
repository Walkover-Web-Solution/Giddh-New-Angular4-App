import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserAuthenticated } from "../decorators/UserAuthenticated";
import { MobileHomeComponent } from "./mobile-home.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: MobileHomeComponent, canActivate: [UserAuthenticated]
            }
        ])
    ]
})

export class MobileHomeRoutingModule {

}