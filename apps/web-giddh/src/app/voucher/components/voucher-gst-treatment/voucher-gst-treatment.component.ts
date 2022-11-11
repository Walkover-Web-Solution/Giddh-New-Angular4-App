import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'voucher-gst-treatment-component',
    templateUrl: './voucher-gst-treatment.component.html',
    styleUrls: [`./voucher-gst-treatment.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class VoucherGstTreatmentComponent {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    constructor() {
    }

    /**
     * This will use for click inside
     *
     * @param {*} event
     * @memberof VoucherGstTreatmentComponent
     */
    public clickInside(event) {
        event.preventDefault();
        event.stopPropagation();  // <- that will stop propagation on lower layers
    }
}
