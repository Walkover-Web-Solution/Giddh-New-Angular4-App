import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';

@Component({
  selector: 'app-aside-recurring-entry',
  templateUrl: './aside.menu.recurringEntry.component.html',
  styles: [`
    :host{
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
    }
    #close{
      display: none;
    }
    :host.in  #close{
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }
    :host .container-fluid{
      padding-left: 0;
      padding-right: 0;
    }
    :host .aside-pane {
      width: 480px;
    }
  `],
})

export class AsideMenuRecurringEntryComponent implements OnInit {
  public intervalOptions: IOption[];
  public timeOptions: IOption[];
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  constructor() {
    //
  }

  public ngOnInit() {
    this.intervalOptions = [
      { label: 'Weekly', value: 'weekly' },
      { label: 'Quarterly', value: 'qarterly' },
      { label: 'Halfyearly', value: 'halfyearly' },
      { label: 'Yearly', value: 'yearly' }
    ];

    this.timeOptions = [
      { label: '1st', value: '1' },
      { label: '2nd', value: '2' },
      { label: '3rd', value: '3' },
      { label: '4th', value: '4' },
      { label: '5th', value: '5' },
    ];
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
}
