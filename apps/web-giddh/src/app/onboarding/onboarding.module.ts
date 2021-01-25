import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';

import { SharedModule } from '../shared/shared.module';
import { OnboardingComponent } from './onboarding.component';

const routes: Array<Route> = [{
    path: '', pathMatch: 'full', component: OnboardingComponent
}];
@NgModule({
    declarations: [OnboardingComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        HamburgerMenuComponentModule
    ],
    exports: [
        OnboardingComponent,
        RouterModule
    ]
})
export class OnBoardingModule {}