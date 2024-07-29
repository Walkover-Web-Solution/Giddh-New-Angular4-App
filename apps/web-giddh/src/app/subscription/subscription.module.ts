import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { UserDetailsModule } from '../user-details/user-details.module';

@NgModule({
    imports: [
        CommonModule,
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
        HamburgerMenuModule,
        MatMenuModule,
        MatSortModule,
        FormFieldsModule,
        ReactiveFormsModule,
        FormsModule,
        MatTooltipModule,
        NewConfirmationModalModule,
        MatCardModule,
        MatStepperModule,
        MatRadioModule,
        MatButtonToggleModule,
        AmountFieldComponentModule,
        ClickOutsideModule,
        ShSelectModule,
        MatSelectModule,
        UserDetailsModule
    ],
    exports: [
    ],
    declarations: [SubscriptionComponent, CompanyListDialogComponent, TransferDialogComponent, ChangeBillingComponent, ViewSubscriptionComponent, BuyPlanComponent, ActivateDialogComponent, VerifyOwnershipDialogComponent, MoveCompanyComponent]
})
export class SubscriptionModule { }
