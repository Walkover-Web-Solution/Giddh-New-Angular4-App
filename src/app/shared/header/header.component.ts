import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Rx';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ManageGroupsAccountsComponent } from './components/';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
    `]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public title: Observable<string>;
  public flyAccounts: Subject<boolean>= new Subject<boolean>();
  public noGroups: boolean;
  public languages: any[] = [{ name: 'ENGLISH', value: 'en' }, { name: 'DUTCH', value: 'nl' }];

  /**
   *
   */
  // tslint:disable-next-line:no-empty
  constructor() { }
  // tslint:disable-next-line:no-empty
  public ngOnInit() { }
  // tslint:disable-next-line:no-empty
  public ngAfterViewInit() { }

  public goToManageGroups() {
    // const modalRef = this.modalService.open(ManageGroupsAccountsComponent);
    // modalRef.componentInstance.name = 'ManageGroups';
  }
}
