import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { SettingsComponent } from './settings.component';
import { SettingIntegrationComponent } from './integration/setting.integration.component';

@NgModule({
  declarations: [
    // components here
    SettingsComponent,
    SettingIntegrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TabsModule.forRoot()
  ]
})
export class SettingsModule {}
