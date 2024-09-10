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
import { DeleteTaxConfirmationModelComponent } from './taxes/confirmation/confirmation.model.component';
import { SettingTaxesComponent } from './taxes/setting.taxes.component';
import { SettingTriggerComponent } from './trigger/setting.trigger.component';
import { CreateWarehouseComponent } from './warehouse/create-warehouse/create-warehouse.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { AddressSettingsComponent } from './address-settings/address-settings.component';
import { OtherSettingsComponent } from './other-settings/other-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateBranchComponent } from './branch/create-branch/create-branch.component';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { ReplacePipeModule } from '../shared/helpers/pipes/replace/replace.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { SettingIntegrationPaymentModule } from './integration/payment/setting.integration.payment.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmModalModule } from '../theme/confirm-modal/confirm-modal.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from 'ngx-clipboard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SettingCampaignComponent } from './integration/campaign/setting-campaign/setting-campaign.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NgxPlaidLinkModule } from "ngx-plaid-link";
import { AsideMenuAccountModule } from '../shared/aside-menu-account/aside.menu.account.module';
import { AccountNumberMaskModule } from '../shared/helpers/pipes/accountNumberMaskPipe/accountNumberMask.module';
import { PortalWhiteLabelComponent } from './portal-white-label/portal-white-label.component';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { CreateAddressModule } from '../shared/create-address/create-address.module';
import { CommonModule } from '@angular/common';
import { TagsModule } from './tags/tags.module';
import { TaxAuthorityModule } from '../theme/tax-authority/tax-authority.module';
import { InstitutionsListComponent } from './integration/institutions-list/institutions-list.component';
import { MatListModule } from '@angular/material/list';

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
        SettingTriggerComponent,
        WarehouseComponent,
        CreateWarehouseComponent,
        PersonalInformationComponent,
        PortalWhiteLabelComponent,
        AddressSettingsComponent,
        OtherSettingsComponent,
        CreateBranchComponent,
        SettingCampaignComponent,
        InstitutionsListComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatListModule,
        SettingRountingModule,
        AsideMenuCreateTaxModule,
        ContactModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyModule,
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
        MatSlideToggleModule,
        MatRadioModule,
        MatTooltipModule,
        MatMenuModule,
        MatDatepickerModule,
        NgxPlaidLinkModule,
        AsideMenuAccountModule,
        AccountNumberMaskModule,
        WatchVideoModule,
        CreateAddressModule,
        TagsModule,
        TaxAuthorityModule
    ],
})

export class SettingsModule {
}
