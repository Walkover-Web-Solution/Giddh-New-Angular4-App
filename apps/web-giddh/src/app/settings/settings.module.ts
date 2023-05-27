import { NgModule } from '@angular/core';
import { ContactModule } from '../contact/contact.module';
import { AsideMenuCreateTaxModule } from '../shared/aside-menu-create-tax/aside-menu-create-tax.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { BranchComponent } from './branch/branch.component';
import { DiscountComponent } from './discount/discount.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { SettingLinkedAccountsConfirmationModalComponent } from './linked-accounts/confirmation-modal/confirmation.modal.component';
import { ConnectBankModalComponent } from './linked-accounts/connect-bank-modal/connect.bank.modal.component';
import { SettingLinkedAccountsComponent } from './linked-accounts/setting.linked.accounts.component';
import { SettingPermissionFormComponent } from './permissions/form/form.component';
import { SettingPermissionComponent } from './permissions/setting.permission.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SettingsComponent } from './settings.component';
import { SettingRountingModule } from './settings.routing.module';
import { SettingsTagsComponent } from './tags/tags.component';
import { DeleteTaxConfirmationModelComponent } from './taxes/confirmation/confirmation.model.component';
import { SettingTaxesComponent } from './taxes/setting.taxes.component';
import { SettingTriggerComponent } from './trigger/setting.trigger.component';
import { CreateWarehouseComponent } from './warehouse/create-warehouse/create-warehouse.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/lib/perfect-scrollbar.interfaces';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { AddressSettingsComponent } from './address-settings/address-settings.component';
import { OtherSettingsComponent } from './other-settings/other-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAddressComponent } from './create-address/create-address.component';
import { CreateBranchComponent } from './branch/create-branch/create-branch.component';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { ReplacePipeModule } from '../shared/helpers/pipes/replace/replace.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { SettingIntegrationPaymentModule } from './integration/payment/setting.integration.payment.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ConfirmModalModule } from '../theme/confirm-modal/confirm-modal.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ClipboardModule } from 'ngx-clipboard';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { SettingCampaignComponent } from './integration/campaign/setting-campaign/setting-campaign.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        SettingsComponent,
        SettingIntegrationComponent,
        SettingProfileComponent,
        SettingTaxesComponent,
        DeleteTaxConfirmationModelComponent,
        SettingLinkedAccountsComponent,
        ConnectBankModalComponent,
        SettingLinkedAccountsConfirmationModalComponent,
        FinancialYearComponent,
        SettingPermissionComponent,
        SettingPermissionFormComponent,
        BranchComponent,
        DiscountComponent,
        SettingsTagsComponent,
        SettingTriggerComponent,
        WarehouseComponent,
        CreateWarehouseComponent,
        CreateAddressComponent,
        PersonalInformationComponent,
        AddressSettingsComponent,
        OtherSettingsComponent,
        CreateBranchComponent,
        SettingCampaignComponent
    ],
    imports: [
        SharedModule,
        SettingRountingModule,
        AsideMenuCreateTaxModule,
        ContactModule,
        ReactiveFormsModule,
        CurrencyModule,
        PerfectScrollbarModule,
        TextMaskModule,
        NgxMaskModule.forRoot(),
        DigitsOnlyModule,
        ShSelectModule,
        SalesShSelectModule,
        TaxSidebarModule,
        ReplacePipeModule,
        NoDataModule,
        SettingIntegrationPaymentModule,
        MatTabsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatSelectModule,
        MatDialogModule,
        ConfirmModalModule,
        MatSlideToggleModule,
        BsDropdownModule.forRoot(),
        MatGridListModule,
        FormFieldsModule,
        MatInputModule,
        ClipboardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSlideToggleModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})

export class SettingsModule {
}
