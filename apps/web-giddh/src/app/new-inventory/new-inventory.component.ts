import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ASIDE_PANE_CONFIG, GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import * as dayjs from 'dayjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'new-inventory',
    templateUrl: './new-inventory.component.html',
    styleUrls: ['./new-inventory.component.scss'],

})

export class NewInventoryComponent implements OnInit {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: boolean = true;
    /* This will store modal reference */
    @ViewChild('asideMenuStateForCreateNewGroupTemplate') public asideMenuStateForCreateNewGroupTemplate: TemplateRef<any>;
    /* This will store modal reference */
    public asideMenuStateForCreateNewGroupDialogRef: MatDialogRef<any>;
    /* This will store modal reference */
    public dialogRef: MatDialogRef<any>;
    /* More button dropdown */
    public moreBtnDropwon: BsDropdownDirective;
    /* show search input field full width */
    public inputFullWidth: boolean = true;
    /* show search input field full width */
    public dateRangFullWidth: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;
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

    constructor(
        private _breakPointObservar: BreakpointObserver,
        private dialog: MatDialog
    ) { }
    
    /* show/hide funcation search input field */
    public searhcGroup() {
        this.inputFullWidth = !this.inputFullWidth
    }
    public focusOnInput() {

    }
    public expandDateRang() {
        this.dateRangFullWidth = !this.dateRangFullWidth
    }

    /**
     * This will open aside pane dialog for revision history
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public openAsidePaneDialog(): void {
        this.asideMenuStateForCreateNewGroupDialogRef.close();
        this.asideMenuStateForCreateNewGroupDialogRef = this.dialog.open(this.asideMenuStateForCreateNewGroupTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * This will open aside pane dialog for revision history
     *
     * @memberof InvoicePreviewDetailsComponent
     */
    public createGroupToggleAsidePane(): void {
        this.asideMenuStateForCreateNewGroupDialogRef.close();
        this.asideMenuStateForCreateNewGroupDialogRef = this.dialog.open(this.asideMenuStateForCreateNewGroupTemplate, ASIDE_PANE_CONFIG);
    }

    /* Create item aside pane open function */
    public createItemToggleAsidePane(event?): void {
        this.asideMenuStateForCreateNewGroupDialogRef.close();
        this.asideMenuStateForCreateNewGroupDialogRef = this.dialog.open(this.asideMenuStateForCreateNewGroupTemplate, ASIDE_PANE_CONFIG);
    }

    /* Create unit aside pane open function */
    public createUnitToggleAsidePane(): void {
        this.asideMenuStateForCreateNewGroupDialogRef.close();
        this.asideMenuStateForCreateNewGroupDialogRef = this.dialog.open(this.asideMenuStateForCreateNewGroupTemplate, ASIDE_PANE_CONFIG);
    }

    /* Create combo aside pane open function */
    public createComboToggleAsidePane(): void {
        this.asideMenuStateForCreateNewGroupDialogRef.close();
        this.asideMenuStateForCreateNewGroupDialogRef = this.dialog.open(this.asideMenuStateForCreateNewGroupTemplate, ASIDE_PANE_CONFIG);
    }

    /**
    * This will toggle the settings popup
    *
    * @param {*} [event]
    * @memberof SettingsComponent
    */
    public toggleSettingPane(event?): void {
        if (this.isMobileScreen && event && this.asideInventorySidebarMenuState) {
            this.asideInventorySidebarMenuState = false;
        }
    }
    /* advance serach modal */
    public openModal(inventoryAdvanceSearch: TemplateRef<any>) {
        this.dialogRef = this.dialog.open(inventoryAdvanceSearch, {
            panelClass: 'modal-md'
        });
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

