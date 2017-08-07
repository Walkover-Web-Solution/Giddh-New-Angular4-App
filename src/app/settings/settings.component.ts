import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('staticTabs') private staticTabs: TabsetComponent;

  public ngOnInit() {
    console.log('hello from Settings');
    this.selectTab(1);
  }

  private selectTab(id: number) {
    this.staticTabs.tabs[id].active = true;
  }
  private disableEnable() {
    this.staticTabs.tabs[2].disabled = ! this.staticTabs.tabs[2].disabled;
  }
}
