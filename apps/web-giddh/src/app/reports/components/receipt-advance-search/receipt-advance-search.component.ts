import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ReceiptAdvanceSearchModel } from '../../constants/reports.constant';

@Component({
	selector: 'receipt-advance-search',
	templateUrl: './receipt-advance-search.component.html',
    styleUrls: ['./receipt-advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiptAdvanceSearchComponent {

    /** Close modal emitter */
    @Output() public closeModal: EventEmitter<void> = new EventEmitter();
    /** Confirm modal emitter */
    @Output() public confirm: EventEmitter<ReceiptAdvanceSearchModel> = new EventEmitter();
    /** Cancel modal emitter */
    @Output() public cancel: EventEmitter<void> = new EventEmitter();
    /** Search modal input */
    @Input() public searchModel: ReceiptAdvanceSearchModel;

    /** @ignore */
	constructor() {
	}
}
