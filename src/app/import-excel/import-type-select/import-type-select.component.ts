import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { Observable } from 'rxjs';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';

@Component({
  selector: 'import-type-select',  // <home></home>
  styleUrls: ['./import-type-select.component.scss'],
  templateUrl: './import-type-select.component.html'
})

export class ImportTypeSelectComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _importExcelActions: ImportExcelActions
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(this._importExcelActions.resetImportExcelState());
  }

  public ngAfterViewInit(): void {
    //
  }

  public ngOnDestroy() {
    //
  }
}
