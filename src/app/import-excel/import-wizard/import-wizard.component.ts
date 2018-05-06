import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ImportExcelRequestStates, ImportExcelState } from '../../store/import-excel/import-excel.reducer';
import { ImportExcelData } from '../../models/api-models/import-excel';

@Component({
  selector: 'import-wizard',  // <home></home>
  styleUrls: ['./import-wizard.component.scss'],
  templateUrl: './import-wizard.component.html'
})

export class ImportWizardComponent implements OnInit, OnDestroy, AfterViewInit {
  public step: number = 1;
  public entity: string;
  public isUploadInProgress: boolean = false;
  public excelState: ImportExcelState;
  public mappedData: ImportExcelData;

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _importActions: ImportExcelActions
  ) {
  }

  public dataChanged = (excelState: ImportExcelState) => {
    this.excelState = excelState;
    if (excelState.requestState === ImportExcelRequestStates.UploadFileSuccess) {
      this.step = 2;
    }
    this.isUploadInProgress = excelState.requestState === ImportExcelRequestStates.UploadFileInProgress;
  }

  public ngAfterViewInit(): void {
    //
  }

  public ngOnDestroy() {
    //
  }

  public onFileUpload(file: File) {
    this.store.dispatch(this._importActions.uploadFileRequest(this.entity, file));
  }

  public onNext(importData: ImportExcelData) {
    console.log(importData);
    this.mappedData = importData;
    this.step++;
  }

  public onBack() {
    this.step--;
  }

  public ngOnInit() {
    this._activatedRoute.url.subscribe(p => this.entity = p[0].path);
    this.store.select(p => p.importExcel)
      .subscribe(this.dataChanged);
  }
}
