import { SettingPermissionComponent } from './permissions/setting.permission.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { SettingsComponent } from './settings.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SharedModule } from '../shared/shared.module';
import { SettingTaxesComponent } from './Taxes/setting.taxes.component';
// import { SettingsLinkedAccountsComponent } from './linked-accounts/settings.linked-accounts.component';
import { DeleteTaxConfirmationModelComponent } from './Taxes/confirmation/confirmation.model.component';
import { SettingRountingModule } from './settings.routing.module';
import { SettingLinkedAccountsComponent } from './linked-accounts/setting.linked.accounts.component';
import { ConnectBankModalComponent } from './linked-accounts/connect-bank-modal/connect.bank.modal.component';
import { SettingLinkedAccountsConfirmationModalComponent } from './linked-accounts/confirmation-modal/confirmation.modal.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { SettingPermissionFormComponent } from './permissions/form/form.component';
@NgModule({
  declarations: [
    // components here
    SettingsComponent,
    SettingIntegrationComponent,
    SettingProfileComponent,
    SettingTaxesComponent,
    // SettingsLinkedAccountsComponent,
    DeleteTaxConfirmationModelComponent,
    SettingLinkedAccountsComponent,
    ConnectBankModalComponent,
    SettingLinkedAccountsConfirmationModalComponent,
    FinancialYearComponent,
    SettingPermissionComponent,
    SettingPermissionFormComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingRountingModule,
    TabsModule.forRoot(),
    SharedModule
  ]
})
export class SettingsModule { }
