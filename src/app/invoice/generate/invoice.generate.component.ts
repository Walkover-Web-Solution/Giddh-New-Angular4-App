import { Component, OnInit, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
const counts = [12, 25, 50, 100];
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  styleUrls: ['./invoice.generate.component.css'],
  templateUrl: './invoice.generate.component.html'
})
export class InvoiceGenerateComponent implements OnInit {

  private modalRef: BsModalRef;
  private config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };
  private counts: number[] = counts;

  constructor(private modalService: BsModalService) {}

  public ngOnInit() {
    console.log('from InvoiceGenerateComponent');
  }

  private showInvoiceModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, this.config, {class: 'gray modal-liquid'}));
  }

  private closeInvoiceModel(e) {
    console.log(e, 'closeInvoiceModel');
    this.modalRef.hide();
  }

  private getInvoiceByFilters(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
  }

  private showNewInvoiceCreate() {
    console.log ('showNewInvoiceCreate open modal');
  }

}
