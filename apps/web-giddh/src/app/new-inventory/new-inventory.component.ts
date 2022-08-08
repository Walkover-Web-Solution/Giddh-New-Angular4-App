import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../services/general.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
@Component({
    selector: 'new-inventory',
    templateUrl: './new-inventory.component.html',
    styleUrls: ['./new-inventory.component.scss'],

})

export class NewInventoryComponent implements OnInit {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* More button dropdown */
    public moreBtnDropwon: BsDropdownDirective;
    /* show search input field full width */
    public inputFullWidth: boolean = true;
    /* show search input field full width */
    public dateRangFullWidth: boolean = true;
    /* This will store modal reference */
    public modalRef: BsModalRef;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
        private _breakPointObservar: BreakpointObserver
    ) { }

    /*datepicker funcation*/
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }
    /**
     * This will hide the datepicker
     *
     * @memberof DaybookComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }
    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof DaybookComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }
    /* show/hide funcation search input field */
    public searhcGroup() {
        this.inputFullWidth = !this.inputFullWidth
    }
    public focusOnInput() {

    }
    public expandDateRang() {
        this.dateRangFullWidth = !this.dateRangFullWidth
    }


    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /* Aside pane open function */
    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create group aside pane open function */
    public createGroupToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create item aside pane open function */
    public createItemToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create unit aside pane open function */
    public createUnitToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create combo aside pane open function */
    public createComboToggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
    * This will toggle the settings popup
    *
    * @param {*} [event]
    * @memberof SettingsComponent
    */
    public toggleSettingPane(event?): void {
        this.toggleBodyClass();

        if (this.isMobileScreen && event && this.asideInventorySidebarMenuState === 'in') {
            this.asideInventorySidebarMenuState = "out";
        }
    }
    /* advance serach modal */
    openModal(inventoryAdvanceSearch: TemplateRef<any>) {
        this.modalRef = this.modalService.show(inventoryAdvanceSearch,
            Object.assign({}, { class: 'modal-lg' })
        );
    }

    public ngOnInit() {
        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

