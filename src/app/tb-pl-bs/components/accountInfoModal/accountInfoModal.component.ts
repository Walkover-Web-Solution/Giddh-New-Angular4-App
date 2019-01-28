import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:'accountInfoModal',
  templateUrl: './accountInfoModal.component.html',
  styleUrls: ['./accountInfoModal.component.scss']
})

export class AccountInfoModalComponent {
  @Input() public title: string = 'Confirm';
  @Input() public body: string = '';
  @Input() public number: string = '';
  @Input() public ok: string = 'Yes';
  @Input() public cancel: string = 'No';
  @Input('isAccountInfoModalOpen') public isAccountInfoModalOpen: boolean;

  @Output() public closeModal: EventEmitter<boolean> = new EventEmitter();

  @Output() public successCallBack: EventEmitter<any> = new EventEmitter();

  @Output() public cancelCallBack: EventEmitter<any> = new EventEmitter();

}
