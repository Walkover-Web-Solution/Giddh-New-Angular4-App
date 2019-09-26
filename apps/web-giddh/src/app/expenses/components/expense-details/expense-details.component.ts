import { Component, OnInit, TemplateRef } from '@angular/core';
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

  constructor(private modalService: BsModalService) {}

  openModal(RejectionReason: TemplateRef<any>) {
    this.modalRef = this.modalService.show(RejectionReason, {class: 'modal-md'});
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
}
