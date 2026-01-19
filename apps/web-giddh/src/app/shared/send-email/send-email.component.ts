import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoucherTypeEnum } from '../../models/api-models/Sales';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'send-email',
    templateUrl: './send-email.component.html',
    styleUrls: ['./send-email.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * SendEmailComponent component
 * Handles sendemail functionality and user interactions
 */
export class SendEmailComponent implements OnInit {
    /** Holds voucher type */
    @Input() voucherType: VoucherTypeEnum;
    /** Holds email to prefill */
    @Input() email: string;
    /** Emitting success event in case of send email */
    @Output() public successEvent: EventEmitter<any> = new EventEmitter<any>();
    /** Holds list of email */
    public emailAddresses: string = '';
    /** Holds download copies */
    public downloadCopy: string[] = ['Original'];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds receipt voucher type */
    public receiptVoucherType: string = VoucherTypeEnum.receipt;
    /** Holds payment voucher type */
    public paymentVoucherType: string = VoucherTypeEnum.payment;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
    }

    /**
     * Initializes the component
     *
     * @memberof SendEmailComponent
     */
    public ngOnInit(): void {
        /**
         * Handles if functionality
         */
        if (this.email) {
            this.emailAddresses = this.email;
        }
    }

    /**
     * Selects download options
     *
     * @param {*} event
     * @memberof SendEmailComponent
     */
    public selectDownloadOptions(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            let value = event.source?.value;
            /**
             * Handles if functionality
             */
            if (event.checked) {
                this.downloadCopy.push(value);
            } else {
                this.downloadCopy = this.downloadCopy?.filter(voucher => voucher !== value);
            }
        }
    }

    /**
     * This will emit the email addresses to send email
     *
     * @memberof SendEmailComponent
     */
    public sendEmail(): void {
        this.successEvent.emit({ email: this.emailAddresses, downloadCopy: this.downloadCopy });
    }
}
