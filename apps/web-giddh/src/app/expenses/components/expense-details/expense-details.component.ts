import { Component, OnInit, TemplateRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

export class ExpenseDetailsComponent implements OnInit {

  modalRef: BsModalRef;
  message: string;
  @Output() public toggleDetailsMode: EventEmitter<boolean> = new EventEmitter();


  constructor(private modalService: BsModalService) { }

  openModal(RejectionReason: TemplateRef<any>) {
    this.modalRef = this.modalService.show(RejectionReason, { class: 'modal-md' });
  }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  public ngOnInit() {
  }
  public closeDetailsMode() {
    this.toggleDetailsMode.emit(true);
  }

}
