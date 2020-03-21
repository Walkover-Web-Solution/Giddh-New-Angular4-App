import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ReceiptAdvanceSearchModel } from '../../constants/reports.constant';

@Component({
	selector: 'receipt-advance-search',
	templateUrl: './receipt-advance-search.component.html',
    styleUrls: ['./receipt-advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReceiptAdvanceSearchComponent {

    @Output() public closeModal: EventEmitter<void> = new EventEmitter();
    @Output() public confirm: EventEmitter<ReceiptAdvanceSearchModel> = new EventEmitter();
    @Output() public cancel: EventEmitter<void> = new EventEmitter();

    @Input() public searchModel: ReceiptAdvanceSearchModel;

	constructor() {
	}
}
