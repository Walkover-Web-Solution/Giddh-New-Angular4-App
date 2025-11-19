import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { DataListComponent } from './components/data-list/data-list.component';
import { StepperFormComponent } from './components/stepper-form/stepper-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'list', component: DataListComponent },
  { path: 'create', component: StepperFormComponent },
  { path: 'edit/:uniqueName', component: StepperFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BankStatementRoutingModule {
}
