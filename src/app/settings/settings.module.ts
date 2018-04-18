import { ShSelectModule } from './../theme/ng-virtual-select/sh-select.module';
import { SettingPermissionComponent } from './permissions/setting.permission.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SettingPermissionFormComponent } from './permissions/form/form.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OmitByKeyPipeModule } from '../shared/helpers/pipes/omitBy/omitBy.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { BranchComponent } from './branch/branch.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { SettingsTagsComponent } from './tags/tags.component';

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
    SettingPermissionFormComponent,
    BranchComponent,
    SettingsTagsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingRountingModule,
    TabsModule,
    DatepickerModule,
    ModalModule,
    SelectModule,
    LaddaModule,
    ClickOutsideModule,
    BsDatepickerModule.forRoot(),
    ShSelectModule,
    OmitByKeyPipeModule,
    NgbTypeaheadModule,
    BsDropdownModule,
    ElementViewChildModule
  ]
})

export class SettingsModule { }
