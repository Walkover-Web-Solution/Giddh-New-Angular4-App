import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
    @Input() public title: string = 'Confirm';
    @Input() public body: string = '';
    @Input() public ok: string = 'Yes';
    @Input() public cancel: string = 'No';

    @Output() public successCallBack: EventEmitter<any> = new EventEmitter();

    @Output() public cancelCallBack: EventEmitter<any> = new EventEmitter();

    // tslint:disable-next-line:no-empty
    constructor() {
    }

    public onSuccess(e: Event) {
        this.successCallBack.emit(e);
    }

    public onCancel(e: Event) {
        this.cancelCallBack.emit(e);
    }
}
