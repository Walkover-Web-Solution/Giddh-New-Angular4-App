import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-e-way-bill-create',
  templateUrl: './eWayBill.create.component.html',
  styleUrls: ['./eWayBill.create.component.scss']
})

export class EWayBillCreateComponent implements OnInit {
  @ViewChild('eWayBillCredentials') public eWayBillCredentials: ModalDirective;

  public modalConfig = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  constructor() {
    //
  }

  public toggleEwayBillCredentialsPopup() {
    this.eWayBillCredentials.toggle();
  }

  public ngOnInit() {
    //
  }
  public onSubmitEwaybill(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }
}
