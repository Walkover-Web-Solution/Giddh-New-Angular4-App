import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { RouterModule } from '@angular/router';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { SubscriptionRoutingModule } from './subscription.routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { ChangeBillingComponent } from './change-billing/change-billing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { BuyPlanComponent } from './buy-plan/buy-plan.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { ActivateDialogComponent } from './activate-dialog/activate-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { CompanyListDialogComponent } from './company-list-dialog/company-list-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { VerifyOwnershipDialogComponent } from './verify-ownership-dilaog/verify-ownership-dilaog.component';
import { MoveCompanyComponent } from './move-company/move-company.component';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { MatSelectModule } from '@angular/material/select';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { CompanyDetailsSidebarComponent } from './components/company-details-sidebar/company-details-sidebar.component';
import { AllFeaturesComponent } from './components/all-features/all-features.component';
import { AddOnsComponent } from './components/add-ons/add-ons.component';
import { SubscriptionsPlansComponent } from './components/subscriptions-plans/subscriptions-plans.component';
import { UserDetailsPipe } from './user-details.pipe';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { SharedModule } from '../shared/shared.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { SafePipeModule } from '../shared/helpers/pipes/safePipe/safePipe.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { OldSubscriptionComponent } from './components/old-subscription/old-subscription.component';
import { PaymentMethodDialogComponent } from './payment-method-dialog/payment-method-dialog.component';

@NgModule({
    imports: [
        ScrollingModule,
        CommonModule,
        MatToolbarModule,
        RouterModule,
        TranslateDirectiveModule,
        SubscriptionRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTableModule,
        MatTooltipModule,
        NoDataModule,
        GiddhPageLoaderModule,
        MatSliderModule,
        HamburgerMenuModule,
        MatMenuModule,
        MatSortModule,
        FormFieldsModule,
        ReactiveFormsModule,
        FormsModule,
        ElementViewChildModule,
        WatchVideoModule,
        MatTooltipModule,
        SafePipeModule,
        NewConfirmationModalModule,
        MatCardModule,
        MatStepperModule,
        MatRadioModule,
        MatButtonToggleModule,
        AmountFieldComponentModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatTabsModule,
        ClickOutsideModule,
        ShSelectModule,
        MatSelectModule,
        MatExpansionModule,
        DecimalDigitsModule,
        MatDividerModule,
        SharedModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),

    ],
    exports: [SubscriptionListComponent,
        OldSubscriptionComponent,
        UserDetailsPipe,
        SubscriptionsPlansComponent,
        CompanyDetailsSidebarComponent,
        MoveCompanyComponent,
        AllFeaturesComponent,
        SubscriptionComponent,
        AddOnsComponent
    ],
    declarations: [
        SubscriptionComponent,
        OldSubscriptionComponent,
        SubscriptionListComponent,
        CompanyListDialogComponent,
        PaymentMethodDialogComponent,
        TransferDialogComponent,
        ChangeBillingComponent,
        ViewSubscriptionComponent,
        BuyPlanComponent,
        ActivateDialogComponent,
        VerifyOwnershipDialogComponent,
        MoveCompanyComponent,
        SubscriptionsPlansComponent,
        CompanyDetailsSidebarComponent,
        MoveCompanyComponent,
        AllFeaturesComponent,
        AddOnsComponent,
        UserDetailsPipe
    ],
    providers: [
        DecimalPipe
    ]
})
export class SubscriptionModule { }
