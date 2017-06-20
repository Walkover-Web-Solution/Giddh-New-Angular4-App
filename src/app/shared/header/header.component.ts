import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Rx';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ManageGroupsAccountsComponent } from './components/';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    `]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
  public title: Observable<string>;
  public flyAccounts: Subject<boolean>= new Subject<boolean>();
  public noGroups: boolean;
  public languages: any[] = [{ name: 'ENGLISH', value: 'en' }, { name: 'DUTCH', value: 'nl' }];
  public sideMenu: {isopen: boolean} = {isopen: false};
  public userMenu: {isopen: boolean} = {isopen: false};
  public companyMenu: {isopen: boolean} = {isopen: false};

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor() { }
  // tslint:disable-next-line:no-empty
  public ngOnInit() { }
  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() { }

  public showManageGroupsModal() {
    this.manageGroupsAccountsModal.show();
    // const modalRef = this.modalService.open(ManageGroupsAccountsComponent);
    // modalRef.componentInstance.name = 'ManageGroups';
  }

  public hideManageGroupsModal() {
    this.manageGroupsAccountsModal.hide();
  }
}
