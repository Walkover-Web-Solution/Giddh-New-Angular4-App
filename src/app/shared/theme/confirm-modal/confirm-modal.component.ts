import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent  {
  @Input() public title: string = 'Confirm';
  @Input() public body: string = '';
  @Input() public ok: string = 'Yes';
  @Input() public cancel: string = 'No';

  @Output() public successCallBack: EventEmitter<any> = new EventEmitter();

  @Output() public cancelCallBack: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-empty
  constructor() { }

  public onSuccess() {
    this.successCallBack.emit();
  }

  public onCancel() {
    this.cancelCallBack.emit();
  }
}
