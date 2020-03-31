import { NgModule } from '@angular/core';

import { ContactModule } from '../contact/contact.module';
import { AsideMenuCreateTaxModule } from '../shared/aside-menu-create-tax/aside-menu-create-tax.module';
import { FinancialYearAsideModule } from '../shared/financial-year-aside/financial-year-aside.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { OmitByKeyPipeModule } from '../shared/helpers/pipes/omitBy/omitBy.module';
import { SharedModule } from '../shared/shared.module';
import { BranchComponent } from './branch/branch.component';
import { BunchComponent } from './bunch/bunch.component';
import { BunchAddCompanyModalComponent } from './bunch/components-modal/add-company/bunch-add-company.component';
import { CreateBunchModalComponent } from './bunch/components-modal/create-bunch/create-bunch.component';
import { GetBunchModalComponent } from './bunch/components-modal/get-companies/get-companies.component';
import { DiscountComponent } from './discount/discount.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import {
    SettingLinkedAccountsConfirmationModalComponent,
} from './linked-accounts/confirmation-modal/confirmation.modal.component';
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
import { WarehouseComponent } from './warehouse/warehouse.component';
import { SettingsServiceModule } from './settings-service.module';
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
        BunchComponent,
        CreateBunchModalComponent,
        BunchAddCompanyModalComponent,
        GetBunchModalComponent,
        WarehouseComponent
    ],
    imports: [
        SharedModule,
        SettingRountingModule,
        AsideMenuCreateTaxModule,
        FinancialYearAsideModule,
        ContactModule,
        CurrencyModule,
        OmitByKeyPipeModule,
        SettingsServiceModule
    ]
})


export class SettingsModule {
}
