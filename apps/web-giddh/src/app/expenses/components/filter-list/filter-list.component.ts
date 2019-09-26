import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})

export class FilterListComponent implements OnInit {

  filterItems = [
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: 'icon-atm-card', imgIcon: '', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: '', imgIcon: 'icon-image', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: '', imgIcon: '', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: 'icon-image', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: '', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: '', imgIcon: '', multiple: 'icon-folder-group'},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: 'icon-image', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: 'icon-atm-card', imgIcon: '', multiple: ''},
    {filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: 'icon-image', multiple: ''},
  ];


  modalRef: BsModalRef;
  message: string;
  constructor(private modalService: BsModalService) {}

  openModal(filterModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(filterModal, {class: 'modal-md'});
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
