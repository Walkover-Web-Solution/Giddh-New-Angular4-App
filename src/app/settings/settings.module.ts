import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { SettingsComponent } from './settings.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';
import { SettingProfileComponent } from './profile/setting.profile.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    // components here
    SettingsComponent,
    SettingIntegrationComponent,
    SettingProfileComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    TabsModule.forRoot(),
    SharedModule
  ]
})
export class SettingsModule {}
