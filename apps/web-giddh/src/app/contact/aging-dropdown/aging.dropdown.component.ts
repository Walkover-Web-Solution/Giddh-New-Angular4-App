import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { AgingDropDownoptions } from '../../models/api-models/Contact';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { AgingReportActions } from '../../actions/aging-report.actions';

@Component({
    selector: 'aging-dropdown',
    templateUrl: 'aging.dropdown.component.html',
    styleUrls: ['./aging.dropdown.component.scss']
})
export class AgingDropdownComponent implements OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public showComponent: boolean = true;
    @Output() public closeEvent: EventEmitter<any> = new EventEmitter();
    @Input() public options: AgingDropDownoptions;
    public setDueRangeRequestInFlight$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private toasty: ToasterService, private agingReportActions: AgingReportActions) {
        this.setDueRangeRequestInFlight$ = this.store.pipe(select(s => s.agingreport.setDueRangeRequestInFlight), takeUntil(this.destroyed$));
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closeAgingDropDown() {
        this.store.dispatch(this.agingReportActions.CloseDueRange());
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
            this.store.dispatch(this.agingReportActions.CreateDueRange({ range: [this.options.fourth.toString(), this.options.fifth.toString(), this.options.sixth.toString()] }));
        }
        this.closeAgingDropDown();
    }
    
    public closeAging(e) {
        this.closeAgingDropDown();
    }

    private showToaster() {
        this.toasty.showSnackBar("error", this.localeData?.aging_dropdown_error);
    }
}
