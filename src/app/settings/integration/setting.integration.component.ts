import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'setting-integration',
  templateUrl: './setting.integration.component.html'
})
export class SettingIntegrationComponent implements OnInit {

  public ngOnInit() {
    console.log('hello from SettingIntegrationComponent');
  }
}
