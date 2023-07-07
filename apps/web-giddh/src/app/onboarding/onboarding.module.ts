import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { OnboardingComponent } from "./onboarding.component";
import { OnboardingRoutingModule } from "./onboarding.routing.module";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        OnboardingComponent
    ],
    imports: [
        CommonModule,
        OnboardingRoutingModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        RouterModule,
        MatButtonModule,
        MatRadioModule,
        FormsModule
    ]
})

export class OnboardingModule {

}