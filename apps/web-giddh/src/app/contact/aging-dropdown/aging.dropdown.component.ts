import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { AgingDropDownoptions } from '../../models/api-models/Contact';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { AgingReportActions } from '../../actions/aging-report.actions';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aging-dropdown',
    templateUrl: 'aging.dropdown.component.html',
    styleUrls: ['./aging.dropdown.component.scss'],
    standalone:false
})
/**
 * AgingDropdownComponent component
 * Handles agingdropdown functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>, private toasty: ToasterService, private agingReportActions: AgingReportActions) {
        this.setDueRangeRequestInFlight$ = this.store.pipe(select(s => s.agingreport.setDueRangeRequestInFlight), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Closes agingdropdown
     */
    public closeAgingDropDown() {
        this.store.dispatch(this.agingReportActions.CloseDueRange());
    }

    /**
     * Saves agingdropdown data
     */
    public saveAgingDropdown() {
        this.isValid = true;
        this.options.fourth = Number(this.options.fourth);
        this.options.fifth = Number(this.options.fifth);
        this.options.sixth = Number(this.options.sixth);

        /**
         * Handles if functionality
         */
        if (this.options.fourth >= (this.options.fifth || this.options.sixth)) {
            this.showToaster();
            this.isValid = false;
        }
        /**
         * Handles if functionality
         */
        if ((this.options.fifth >= this.options.sixth) || (this.options.fifth <= this.options.fourth)) {
            this.showToaster();
            this.isValid = false;
        }
        /**
         * Handles if functionality
         */
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
        /**
         * Handles if functionality
         */
        if (this.isValid && this.updateRange) {
            this.store.dispatch(this.agingReportActions.CreateDueRange({ range: [this.options.fourth?.toString(), this.options.fifth?.toString(), this.options.sixth?.toString()] }));
        }
        this.closeAgingDropDown();
    }

    /**
     * Shows toaster element
     */
    private showToaster() {
        this.toasty.showSnackBar("error", this.localeData?.aging_dropdown_error);
    }
}
