import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { MatButtonModule } from "@angular/material/button";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { BankStatementRoutingModule } from './bank-statement.routing.module';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { DataListComponent } from './components/data-list/data-list.component';
import { StepperFormComponent } from './components/stepper-form/stepper-form.component';
import { EmailForwardingService } from './services/email-forwarding.service';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';

@NgModule({
    declarations: [
        OnboardingComponent,
        DataListComponent,
        StepperFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BankStatementRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        SharedModule,
        NoDataModule,
        MatButtonModule,
        FormFieldsModule,
        MatTableModule,
        MatTooltipModule,
        MatCardModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        GiddhPageLoaderModule,
        NewConfirmationModalModule,
        TranslateDirectiveModule
    ],
    providers: [
        EmailForwardingService
    ]
})
export class BankStatementModule {
}
