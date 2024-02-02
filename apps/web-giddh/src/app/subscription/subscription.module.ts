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
import { CompanyListComponent } from './company-list/company-list.component';
import { MatSortModule } from '@angular/material/sort';
import { TransferComponent } from './transfer/transfer.component';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { ChangeBillingComponent } from './change-billing/change-billing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
        NewConfirmationModalModule
    ],
    exports: [
    ],
    declarations: [SubscriptionComponent, CompanyListComponent, TransferComponent, ChangeBillingComponent]
})
export class SubscriptionModule { }
