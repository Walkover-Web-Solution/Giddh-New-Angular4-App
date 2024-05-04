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
    /** If dropdown has valid values */
    private isValid: boolean = true;
    /** True if range needs to be updated */
    private updateRange: boolean = false;
    /** Emit the close event for parent component */
    @Output() close = new EventEmitter();

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
        this.isValid = true;
        this.options.fourth = Number(this.options.fourth);
        this.options.fifth = Number(this.options.fifth);
        this.options.sixth = Number(this.options.sixth);

        if (this.options.fourth >= (this.options.fifth || this.options.sixth)) {
            this.showToaster();
            this.isValid = false;
        }
        if ((this.options.fifth >= this.options.sixth) || (this.options.fifth <= this.options.fourth)) {
            this.showToaster();
            this.isValid = false;
        }
        if (this.options.sixth <= (this.options.fourth || this.options.fifth)) {
            this.showToaster();
            this.isValid = false;
        }
        this.updateRange = true;
    }

    /**
     * This will use for click outside on ranges
     *
     * @param {*} e
     * @memberof AgingDropdownComponent
     */
    public closeAging(e) {
        this.close.emit();
        if (this.isValid && this.updateRange) {
            this.store.dispatch(this.agingReportActions.CreateDueRange({ range: [this.options.fourth?.toString(), this.options.fifth?.toString(), this.options.sixth?.toString()] }));
        }
        this.closeAgingDropDown();
    }

    private showToaster() {
        this.toasty.showSnackBar("error", this.localeData?.aging_dropdown_error);
    }
}
