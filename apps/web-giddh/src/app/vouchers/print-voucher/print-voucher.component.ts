import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'print-voucher',
  templateUrl: './print-voucher.component.html',
  styleUrls: ['./print-voucher.component.scss']
})
export class PrintVoucherComponent implements OnInit {
    /* Emitter for cancel event */
    @Output() public cancelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor() {}

    ngOnInit() {}
}
