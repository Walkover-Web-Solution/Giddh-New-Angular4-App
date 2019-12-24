import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { VirtualScrollComponent } from './virtual-scroll';
import { IOption } from './sh-options.interface';

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

    @Output() public noToggleClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public noResultClicked = new EventEmitter<null>();
    @ViewChild(VirtualScrollComponent) public virtualScrollElm: VirtualScrollComponent;
    @ViewChild('listContainer') public listContainer: ElementRef;
    public math: any = Math;
    public viewPortItems: IOption[];

    public _rows: IOption[];

    @Input() set rows(val: IOption[]) {
        if (this.virtualScrollElm) {
            // this.virtualScrollElm.scrollInto(this._rows[0]);
        }

        this._rows = val;

        if (this.virtualScrollElm) {
            this.virtualScrollElm.refresh();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        // if (changes['isOpen'] && changes['isOpen'].currentValue) {
        //   this.dyHeight = Number(window.getComputedStyle(this.listContainer.nativeElement).height);
        // }
    }

    public toggleSelected(row) {
        this.noToggleClick.emit(row);
    }

}
