import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'giddh-custom-pagination',
    templateUrl: './giddh-custom-pagination.component.html',
    styleUrls: ['./giddh-custom-pagination.component.scss']
})
export class GiddhCustomPaginationComponent {
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Holds current page count */
    @Input() public currentPage: Number = 1;
    /* Holds true to disable previous button */
    @Input() public isNextButtonDisabled: Boolean = false;
    /* Holds true to disable next button */
    @Input() public isPreviousButtonDisabled: Boolean = false;
    /** Emits the pageChange event  */
    @Output() public pageChange: EventEmitter<any> = new EventEmitter();

    constructor() { }

    /**
     * Emits events next and previous button clicked
     *
     * @param {boolean} isNextPage
     * @memberof GiddhCustomPaginationComponent
     */
    public emitsPageChangeEvent(isNextPage: boolean): void {
        this.pageChange.emit({nextPage:  isNextPage, previousPage: !isNextPage });
    }
}
