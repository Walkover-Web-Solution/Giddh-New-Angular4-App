import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import { AppState } from '../../../store/roots';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {CompanyResponse} from "../../../models/api-models/Company";
import {CompanyActions} from "../../../actions/company.actions";
import {CompanyAddComponent} from "../../../shared/header/components";

@Component({
  selector: 'user-detail-company',
  styleUrls: ['./user-details-company.component.css'],
  templateUrl: './user-details-company.component.html'
})

export class UserDetailsCompanyComponent implements OnInit {

  //array holding list of companies to be displayed on UI
  private companies = [];

  //Observable for change in company list
  private companies$: Observable<CompanyResponse[]>;

  //variable storing selected company
  private selectedCmp: CompanyResponse;

  //observable for giddh spinner
  public isGetAllRequestInProcess$: Observable<boolean> = of(true);

  //Modal reference variables
  modalRef: BsModalRef;



  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private modalService: BsModalService, private store: Store<AppState>, private _companyActions: CompanyActions) {
    this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
    this.isGetAllRequestInProcess$ = this.store.select(p => p.company.isCompanyActionInProgress).pipe(takeUntil(this.destroyed$));
  }

  openModal(template: TemplateRef<any>, selectedCompany : CompanyResponse) {
    this.selectedCmp = selectedCompany;
    this.modalRef = this.modalService.show(template);
  }

  confirmDelete(): void {
    this.store.dispatch(this._companyActions.DeleteCompany(this.selectedCmp.uniqueName));
    this.hideModal();
  }
 
  declineDelete(): void {
    this.hideModal();
  }

  hideModal(){
    this.modalRef.hide();
  }

  ngOnInit() {
    this.companies$.subscribe(a => {
      if (a) {
        this.companies = a;
      }
    });
  }
  createNewCompany(template: TemplateRef<any>){
    let config: ModalOptions = {class: 'universal_modal', show: true, keyboard: false, animated: false, backdrop:'static'};
    this.modalRef = this.modalService.show(template, config);
  }
}
