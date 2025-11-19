import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRippleModule } from "@angular/material/core";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';

import { BankStatementRoutingModule } from './bank-statement.routing.module';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { DataListComponent } from './components/data-list/data-list.component';
import { StepperFormComponent } from './components/stepper-form/stepper-form.component';
import { EmailForwardingService } from './services/email-forwarding.service';
import { MatDividerModule } from '@angular/material/divider';

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
        ClickOutsideModule,
        DigitsOnlyModule,
        ElementViewChildModule,
        NgxMaskModule.forRoot(),
        NoDataModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTabsModule,
        MatRippleModule,
        FormFieldsModule,
        MatChipsModule,
        MatTableModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatListModule,
        ScrollingModule,
        MatSortModule,
        MatPaginatorModule,
        MatCardModule,
        MatStepperModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        GiddhPageLoaderModule,
        WatchVideoModule,
        MatDividerModule
    ],
    providers: [
        EmailForwardingService
    ]
})
export class BankStatementModule {
}
