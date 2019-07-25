import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


import * as moment from 'moment';

@Component({
  selector: 'user-detail-company',
  styleUrls: ['./userDetailsCompany.component.css'],
  templateUrl: './userDetailsCompany.component.html'
})

export class userDetailsCompanyComponent implements OnInit {
  companies = [
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
    {companyName: 'Walkover Web Solutions Public', date: '25/05/2018', address: 'WALKOVER, 405-406, Capt. C. S. Naidu Arcade, Near Greater Kailash Hospital 10/2 Old Palasia, INDORE-452018, M.P.'},
  ]

  modalRef: BsModalRef;
  message: string;
  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
 
  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  ngOnInit() {

  }
}