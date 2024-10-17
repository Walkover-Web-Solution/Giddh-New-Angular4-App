import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'giddh-ledger-paginator',
    templateUrl: './giddh-ledger-paginator.component.html',
    styleUrls: ['./giddh-ledger-paginator.component.scss']
})
export class GiddhLedgerPaginatorComponent {
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Holds current page count */
    @Input() public currentPage: number = 1;
    /** Holds next page token used in emit token */
    @Input() public nextPageToken: string = '';
    /** Holds previous page token used in emit token */
    @Input() public previousPageToken: string = '';
    /** Holds CSS class which apply on main parent */
    @Input() public cssClass: string = 'mr-t15';
    /** Emits the page change event */
    @Output() public pageChange: EventEmitter<string> = new EventEmitter();

    constructor() { }

    /**
     * Emits events next and previous button clicked
     *
     * @param {boolean} isNextPage
     * @memberof GiddhLedgerPaginatorComponent
     */
    public emitsPageChangeEvent(isNextPage: boolean): void {
        this.pageChange.emit(isNextPage ? this.nextPageToken : this.previousPageToken);
    }
}
