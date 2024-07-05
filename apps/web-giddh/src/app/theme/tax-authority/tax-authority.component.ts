import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'tax-authority',
    templateUrl: './tax-authority.component.html',
    styleUrls: ['./tax-authority.component.scss']
})
export class TaxAuthorityComponent implements OnInit {
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Instance of bootstrap modal */
    public modalRef: BsModalRef;
    /** Holds Obligations table data */
    public tableDataSource: any[] = [];
    /** Holds Obligations table columns */
    public displayedColumns = ['start', 'end', 'due', 'status', 'action'];
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,

    ) { }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof TaxAuthorityComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.getTaxAuthority();
    }

    /**
    * Get Tax Authority API Call
    *
    * @memberof TaxAuthorityComponent
    */
    public getTaxAuthority(): void {

    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof TaxAuthorityComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }

}
