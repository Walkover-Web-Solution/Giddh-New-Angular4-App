import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: SettingsComponent, canActivate: [NeedsAuthentication], redirectTo: 'taxes'
      },
      {
        path: ':type', component: SettingsComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class SettingRountingModule {
}
