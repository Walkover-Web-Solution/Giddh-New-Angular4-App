import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
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
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
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
    SharedModule,
    CommonModule,
    FormsModule,
    SettingRountingModule,
    TabsModule,
    SharedModule,
    DatepickerModule,
    ModalModule
  ]
})
export class SettingsModule { }
