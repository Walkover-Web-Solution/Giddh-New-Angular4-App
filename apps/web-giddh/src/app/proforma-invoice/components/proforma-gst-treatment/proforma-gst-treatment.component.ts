import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'proforma-gst-treatment-component',
    templateUrl: './proforma-gst-treatment.component.html',
    styleUrls: [`./proforma-gst-treatment.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProformaGstTreatmentComponent implements OnInit {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    public clickInside(event) {
        event.preventDefault();
        event.stopPropagation();  // <- that will stop propagation on lower layers
    }
}
