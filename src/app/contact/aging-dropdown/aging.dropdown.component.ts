import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { AgingDropDownoptions } from '../../models/api-models/Contact';

@Component({
  selector: 'aging-dropdown',
  templateUrl: 'aging.dropdown.component.html',
  styles: [`
    .li-design {
      display: flex;
      padding: 5px;
      border: none;
    }

    .lable-design {
      width: 60%;
    }

    .input-design {
      width: 40%;
    }

    .depth {
      z-index: 0 !important;
    }
  `]
})

export class AgingDropdownComponent implements OnInit, OnDestroy {
  @Input() public showComponent: boolean = true;
  @Output() public closeEvent: EventEmitter<any> = new EventEmitter();
  @Input() public options: AgingDropDownoptions = {
    fourth: 40,
    fifth: 80,
    sixth: 120,
    fourthDesc: '0-39 Days',
    fifthDesc: '40-79 Days',
    sixthDesc: '80-119 Days',
  };

  constructor(public _toaster: ToasterService) {
    //
  }

  public ngOnInit() {
    //
  }

  public toggleTaxPopup(action: boolean) {
    this.showComponent = action;
  }

  public ngOnDestroy() {
    this.closeEvent.emit(this.options);
  }
}
