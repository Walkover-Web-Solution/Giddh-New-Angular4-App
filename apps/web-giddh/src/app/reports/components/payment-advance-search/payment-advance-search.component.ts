import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentAdvanceSearchModel } from '../../constants/reports.constant';

@Component({
    selector: 'payment-advance-search',
    templateUrl: './payment-advance-search.component.html',
    styleUrls: ['./payment-advance-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentAdvanceSearchComponent {

    /** Close modal emitter */
    @Output() public closeModal: EventEmitter<void> = new EventEmitter();
    /** Confirm modal emitter */
    @Output() public confirm: EventEmitter<PaymentAdvanceSearchModel> = new EventEmitter();
    /** Cancel modal emitter */
    @Output() public cancel: EventEmitter<void> = new EventEmitter();
    /** Search modal input */
    @Input() public searchModel: PaymentAdvanceSearchModel;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    /** @ignore */
    constructor() {
    }
}
