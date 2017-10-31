import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SettingTaxesComponent } from './Taxes/setting.taxes.component';
// import { SettingsLinkedAccountsComponent } from './linked-accounts/settings.linked-accounts.component';
import { DeleteTaxConfirmationModelComponent } from './Taxes/confirmation/confirmation.model.component';
import { SettingRountingModule } from './settings.routing.module';
import { SettingLinkedAccountsComponent } from './linked-accounts/setting.linked.accounts.component';
import { ConnectBankModalComponent } from './linked-accounts/connect-bank-modal/connect.bank.modal.component';
import { SettingLinkedAccountsConfirmationModalComponent } from './linked-accounts/confirmation-modal/confirmation.modal.component';
import { FinancialYearComponent } from './financial-year/financial-year.component';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SelectModule } from '../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';

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
    FinancialYearComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SettingRountingModule,
    TabsModule,
    DatepickerModule,
    ModalModule,
    SelectModule,
    LaddaModule
  ]
})
export class SettingsModule { }
