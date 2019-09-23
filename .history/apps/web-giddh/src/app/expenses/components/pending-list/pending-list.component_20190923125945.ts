import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.scss'],
})

export class PendingListComponen implements OnInit {

  expensesItem = [
    {No: 1, date: '29-07-2019', SubmittedBy: 'Pratik Piplode', acount: 'Stationery A/c', dotWarning: 'dot-warning', dotPrimary: 'dot-primary' ,dotSuccess: 'dot-success' ,mount: 1400, payment: 'ICICI A/c',
    card: '', cash: 'icon-cash',  File: 'attach file', FileIcon: 'icon-file-path', ImgeIcon: '', ImgePath: '', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''},
    {No: 2, date: '29-07-2019', SubmittedBy: 'Pratik Piplode', acount: 'Stationery A/c', amount: 1400, payment: 'Cash A/c',
    card: '', cash: 'icon-cash',  File: '', FileIcon: '', ImgeIcon: 'icon-image', ImgePath: 'sampleimage.jpg', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''},
    {No: 3, date: '29-07-2019', SubmittedBy: 'Pratik Piplode', acount: 'Stationery A/c', amount: 1400, payment: 'SBI A/c',
    card: 'icon-atm-card', cash: '',  File: '', FileIcon: '', ImgeIcon: '', ImgePath: '', multipleIcon: 'icon-folder-group', multiple: 'Multiple', description: 'Dummy text sample test', Action: ''},
    {No: 4, date: '29-07-2019', SubmittedBy: 'Pratik Piplode', acount: 'Stationery A/c', amount: 1400, payment: 'Cash A/c',
    card: '', cash: 'icon-cash',  File: 'attach file', FileIcon: 'icon-file-path', ImgeIcon: '', ImgePath: '', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''},
    {No: 5, date: '29-07-2019', SubmittedBy: 'Pratik Piplode', acount: 'Stationery A/c', amount: 1400, payment: 'ICICI A/c',
    card: 'icon-atm-card', cash: '',  File: '', FileIcon: '', ImgeIcon: 'icon-image', ImgePath: 'sampleimage.jpg', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''},
    {No: 6, date: '29-07-2019', SubmittedBy: 'Pratik Piplode', acount: 'Stationery A/c', amount: 1400, payment: 'Cash A/c',
    card: '', cash: 'icon-cash',  File: '', FileIcon: '', ImgeIcon: '', ImgePath: '', multipleIcon: 'icon-folder-group', multiple: 'Multiple', description: 'Dummy text sample test', Action: ''},
  ]

  constructor() {

  }

  public ngOnInit() {
  }
}
