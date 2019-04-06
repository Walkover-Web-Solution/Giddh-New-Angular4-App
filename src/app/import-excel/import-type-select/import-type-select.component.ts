import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';

@Component({
  selector: 'import-type-select',  // <home></home>
  styleUrls: ['./import-type-select.component.scss'],
  templateUrl: './import-type-select.component.html'
})

export class ImportTypeSelectComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _importExcelActions: ImportExcelActions
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(this._importExcelActions.resetImportExcelState());
  }


  importDatas = [
  {
    DateTime: "05-02-2019, 11:22:22",
    fileName: "Accounts_Jan_2019.Xls" ,
    submittedBy: "Shubhendra Agrawal" ,
    status : "In-Progress 120/290 Processed9:12",
    download : " - "
  },
  {
    DateTime: "07-02-2019, 11:22:22",
    fileName: "Accounts_Jan_2019.Xls" ,
    submittedBy: "Shubhendra Agrawal" ,
    status : "In-Progress 120/290 Processed9:12",
    download : " - "
  },
  {
    DateTime: "05-02-2019, 11:22:22",
    fileName: "Accounts_Jan_2019.Xls" ,
    submittedBy: "Shubhendra Agrawal" ,
    status : "In-Progress 120/290 Processed9:12",
    download : " - "
  },
  {
    DateTime: "05-02-2019, 11:22:22",
    fileName: "Accounts_Jan_2019.Xls" ,
    submittedBy: "Shubhendra Agrawal" ,
    status : "In-Progress 120/290 Processed9:12",
    download : " - "
  }

  ]
}
