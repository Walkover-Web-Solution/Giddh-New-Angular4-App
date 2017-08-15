import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { SettingsComponent } from './settings.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SharedModule } from '../shared/shared.module';
import { SettingTaxesComponent } from './Taxes/setting.taxes.component';
import { DeleteTaxConfirmationModelComponent } from './Taxes/confirmation/confirmation.model.component';
import { SettingRountingModule } from './settings.routing.module';
@NgModule({
  declarations: [
    // components here
    SettingsComponent,
    SettingIntegrationComponent,
    SettingProfileComponent,
    SettingTaxesComponent,
    DeleteTaxConfirmationModelComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    SettingRountingModule,
    TabsModule.forRoot(),
    SharedModule
  ]
})
export class SettingsModule {}
