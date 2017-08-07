import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'setting-profile',
  templateUrl: './setting.profile.component.html'
})
export class SettingProfileComponent implements OnInit {

  public ngOnInit() {
    console.log('hello from SettingProfileComponent');
  }
}
