import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardComponent } from './wizard.component';
import { WizardStepComponent } from './wizard-step.component';

export * from './wizard.component';
export * from './wizard-step.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WizardComponent,
    WizardStepComponent
  ],
  exports: [
    WizardComponent,
    WizardStepComponent
  ]
})
export class FormWizardModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormWizardModule
    };
  }
}
