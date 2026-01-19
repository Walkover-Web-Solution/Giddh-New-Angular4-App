import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OnboardingComponent } from "./onboarding.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: OnboardingComponent
            }
        ])
    ]
})

/**
 * OnboardingRoutingModule module
 * Implements OnboardingRoutingModule functionality
 */
export class OnboardingRoutingModule {

}