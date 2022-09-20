import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { VirtualScrollComponent } from './virtual-scroll';
import { IOption } from './sh-options.interface';
import { isEqual } from '../../lodash-optimized';
import { SELECT_ALL_RECORDS } from '../../app.constant';

@Component({
    selector: 'sh-select-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './sh-select-menu.component.html',
    styleUrls: ['./sh-select-menu.component.scss']
})

export class ShSelectMenuComponent implements OnChanges {
    @Input() public selectedValues: any[];
    @Input() public isOpen: boolean;
    @Input() public optionTemplate: TemplateRef<any>;
    @Input() public notFoundMsg: string;
    @Input() public notFoundLinkText: string = 'Create New';
    @Input() public noResultLinkEnabled: boolean;
    @Input() public ItemHeight: number;
    @Input() public NoFoundMsgHeight: number;
    @Input() public NoFoundLinkHeight: number;
    @Input() public dropdownMinHeight: number;
    @Input() public showNotFoundLinkAsDefault: boolean;
    @Input() public noResultLinkTemplate: TemplateRef<any>;
    /** True if field is required */
    @Input() public isRequired: boolean = false;
    /** This will hold searched text */
    @Input() public filter: string = '';
    /** True when pagination should be enabled */
    @Input() isPaginationEnabled: boolean;
    /** True if select all option is checked */
    @Input() isSelectAllChecked: boolean = false;
    /** Emits the scroll to bottom event when pagination is required  */
    @Output() public scrollEnd: EventEmitter<void> = new EventEmitter();

    @Output() public noToggleClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public noResultClicked = new EventEmitter<null>();
    @ViewChild(VirtualScrollComponent, { static: false }) public virtualScrollElm: VirtualScrollComponent;
    @ViewChild('listContainer', { static: true }) public listContainer: ElementRef;
    public math: any = Math;
    public viewPortItems: IOption[];
    public _rows: IOption[];
    /** This will hold existing data */
    public existingData: IOption[];
    /** Holds string for select all records */
    public selectAllRecords: string = SELECT_ALL_RECORDS;

    @Input() set rows(val: IOption[]) {
        this._rows = val;

        if (!isEqual(this._rows, this.existingData)) {
            this.existingData = this._rows;
            this.autoSelectIfSingleValueAvailable();
        }

        if (this.virtualScrollElm) {
            this.virtualScrollElm.refresh();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['isRequired'] && changes['isRequired'].currentValue !== changes['isRequired'].previousValue) {
            this.autoSelectIfSingleValueAvailable();
        }

        if(changes['isSelectAllChecked']) {
            this.isSelectAllChecked = changes['isSelectAllChecked'].previousValue;
        }
    }

    public toggleSelected(row) {
        if (row?.value === this.selectAllRecords) {
            this._rows.forEach(key => {
                if (this.isSelectAllChecked) {
                    if (this.selectedValues.indexOf(key) !== -1) {
                        this.noToggleClick.emit(key);
                    }
                } else {
                    if (this.selectedValues.indexOf(key) === -1) {
                        this.noToggleClick.emit(key);
                    }
                }
            });
        } else {
            if (!row?.disabled) {
                this.noToggleClick.emit(row);
            }
        }
    }

    /**
     * Scroll to bottom handler
     *
     * @memberof ShSelectMenuComponent
     */
    public reachedEnd(): void {
        this.scrollEnd.emit();
    }

    /**
     * This will auto select the value if 1 value available and field is required
     *
     * @memberof ShSelectMenuComponent
     */
    public autoSelectIfSingleValueAvailable(): void {
        if (this.isRequired && this._rows && this._rows?.length === 1 && !this.filter) {
            setTimeout(() => {
                this.toggleSelected(this._rows[0]);
            }, 150);
        }
    }
}
