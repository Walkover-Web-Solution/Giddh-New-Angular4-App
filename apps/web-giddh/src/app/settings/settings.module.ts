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
import { DeleteTaxConfirmationModelComponent } from './Taxes/confirmation/confirmation.model.component';
import { SettingTaxesComponent } from './Taxes/setting.taxes.component';
import { SettingTriggerComponent } from './Trigger/setting.trigger.component';
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
import { NoDataModule } from '../shared/no-data/no-data.module';


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
        CreateBranchComponent
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
        NoDataModule
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
