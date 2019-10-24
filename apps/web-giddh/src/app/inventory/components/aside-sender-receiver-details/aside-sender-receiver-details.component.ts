import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
@Component({
  selector: 'aside-sender-receiver-details-pane',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 600px;
      max-width: 100%;
      z-index: 99999;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
    position: absolute;
    left: auto;
    top: 14px;
    z-index: 5;
    border: 0;
    border-radius: 0;
    right: 0;
    background: transparent;
    color: #fff;
    font-size: 20px;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 600px;
      max-width: 600px;
    }

    .aside-body {
      margin-bottom: 80px;
    }
.aside-pane{
  padding:0;
}
  `],
  templateUrl: './aside-sender-receiver-details.component.html',
  styleUrls: ['./aside-sender-reciver-details.component.scss'],
})
export class AsideSenderReceiverDetailsPaneComponent {

  public addAddress = false;
  public bankDetails = false;

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  @ViewChild('staticTabs') public staticTabs: TabsetComponent;

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

  closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
  public selectAccount = [{
    label: 'Sundry Debtors', value: 'Sundry Debtors'
  }, {
    label: 'Sundry Creditors', value: 'Sundry Creditors'
  }];

  public selectCountry = [{
    label: 'IN - India', value: 'IN - India'
  }, {
    label: 'US - USA', value: 'US - USA'
  }];

  public partyType = [{
    label: 'Register', value: 'Register'
  }, {
    label: 'Unregister', value: 'Unregister'
  }];
  public selectNoCode = [{
    label: '91', value: '91'
  }, {
    label: '933', value: '933'
  }];




}
