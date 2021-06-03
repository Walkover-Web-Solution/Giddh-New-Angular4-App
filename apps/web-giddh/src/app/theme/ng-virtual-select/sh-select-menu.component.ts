import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { VirtualScrollComponent } from './virtual-scroll';
import { IOption } from './sh-options.interface';
import { isEqual } from '../../lodash-optimized';

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
    @Input() public showCheckbox: boolean = false;
    /** True if field is required */
    @Input() public isRequired: boolean = false;
    /** This will hold searched text */
    @Input() public filter: string = '';

    /** True when pagination should be enabled */
    @Input() isPaginationEnabled: boolean;
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
        // if (changes['isOpen'] && changes['isOpen'].currentValue) {
        //   this.dyHeight = Number(window.getComputedStyle(this.listContainer.nativeElement).height);
        // }
        if (changes['isRequired'] && changes['isRequired'].currentValue !== changes['isRequired'].previousValue) {
            this.autoSelectIfSingleValueAvailable();
        }
    }

    public toggleSelected(row) {
        if (this.showCheckbox) {
            if (row.value === "selectall") {
                let isSelectAllChecked = this.selectedValues.indexOf(row);

                this._rows.forEach(key => {
                    if (isSelectAllChecked === -1) {
                        if (this.selectedValues.indexOf(key) === -1) {
                            this.noToggleClick.emit(key);
                        }
                    } else {
                        if (this.selectedValues.indexOf(key) !== -1) {
                            this.noToggleClick.emit(key);
                        }
                    }
                });
            } else {
                this.noToggleClick.emit(row);
            }
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
        if (this.isRequired && this._rows && this._rows.length === 1 && !this.filter) {
            setTimeout(() => {
                this.toggleSelected(this._rows[0]);
            }, 150);
        }
    }
}
