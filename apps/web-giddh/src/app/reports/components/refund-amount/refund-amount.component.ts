import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
	selector: 'refund-amount',
	templateUrl: './refund-amount.component.html',
	styleUrls: ['./refund-amount.component.scss']
})

export class RefundAmountComponent implements OnInit {

    public tempDateParams: any = {};

	constructor() {
	}

	ngOnInit() {
	}
}
