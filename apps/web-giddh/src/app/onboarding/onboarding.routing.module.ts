import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserAuthenticated } from "../decorators/UserAuthenticated";
import { OnboardingComponent } from "./onboarding.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: OnboardingComponent, canActivate: [UserAuthenticated]
            }
        ])
    ]
})

export class OnboardingRoutingModule {

}