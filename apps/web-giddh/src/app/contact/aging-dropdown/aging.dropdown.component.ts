import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { AgingDropDownoptions } from '../../models/api-models/Contact';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { AgingReportActions } from '../../actions/aging-report.actions';

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
    @Input() public options: AgingDropDownoptions;
    public setDueRangeRequestInFlight$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _toasty: ToasterService, public _toaster: ToasterService, private _agingReportActions: AgingReportActions) {
        //
        this.setDueRangeRequestInFlight$ = this.store.select(s => s.agingreport.setDueRangeRequestInFlight).pipe(takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        //
    }

    public ngOnDestroy() {
        // this.closeEvent.emit(this.options);
    }

    public closeAgingDropDown() {
        this.store.dispatch(this._agingReportActions.CloseDueRange());
    }

    public saveAgingDropdown() {

        let valid = true;
        if (this.options.fourth >= (this.options.fifth || this.options.sixth)) {
            this.showToaster();
            valid = false;
        }
        if ((this.options.fifth >= this.options.sixth) || (this.options.fifth <= this.options.fourth)) {
            this.showToaster();
            valid = false;
        }
        if (this.options.sixth <= (this.options.fourth || this.options.fifth)) {
            this.showToaster();
            valid = false;
        }
        if (valid) {
            this.store.dispatch(this._agingReportActions.CreateDueRange({ range: [this.options.fourth.toString(), this.options.fifth.toString(), this.options.sixth.toString()] }));
        }
        this.closeAgingDropDown();
    }
    public closeAging(e) {
        this.closeAgingDropDown();
    }

    private showToaster() {
        this._toasty.errorToast('4th column must be less than 5th and 5th must be less than 6th');
    }
}
