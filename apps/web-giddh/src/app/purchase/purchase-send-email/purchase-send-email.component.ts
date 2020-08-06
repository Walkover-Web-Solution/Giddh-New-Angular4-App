import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'purchase-send-email-modal',
    templateUrl: './purchase-send-email.component.html',
    styleUrls: ['./purchase-send-email.component.scss']
})

export class PurchaseSendEmailModalComponent implements OnInit {
    @Input() public selectedItem: any;

    constructor() { 

    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseSendEmailModalComponent
     */
    public ngOnInit(): void {

    }
}