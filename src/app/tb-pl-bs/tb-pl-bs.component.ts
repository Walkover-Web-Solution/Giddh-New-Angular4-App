import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ComapnyResponse } from '../models/api-models/Company';

@Component({
  selector: 'tb-pl-bs',
  templateUrl: './tb-pl-bs.component.html'
})
export class TbPlBsComponent implements OnInit, AfterViewInit {

  public selectedCompany: ComapnyResponse;

  constructor(private store: Store<AppState>) {
    this.store.select(p => p.company.companies && p.company.companies.find(q => q.uniqueName === p.session.companyUniqueName)).subscribe(p => {
      this.selectedCompany = p;
    });
  }

  public ngOnInit() {
    console.log('hello TlPl module');
  }

  public ngAfterViewInit() {
    //
  }
}
