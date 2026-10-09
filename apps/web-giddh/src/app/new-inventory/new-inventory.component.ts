import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import * as dayjs from 'dayjs';
@Component({
    selector: 'new-inventory',
    templateUrl: './new-inventory.component.html',
    styleUrls: ['./new-inventory.component.scss'],
    standalone: false
})

export class NewInventoryComponent implements OnDestroy {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: boolean = true;
    /* show search input field full width */
    public inputFullWidth: boolean = true;
    /* show search input field full width */
    public dateRangFullWidth: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    constructor() { }

    /* show/hide funcation search input field */
    public searhcGroup() {
        this.inputFullWidth = !this.inputFullWidth
    }
    public focusOnInput() {

    }
    public expandDateRang() {
        this.dateRangFullWidth = !this.dateRangFullWidth
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

