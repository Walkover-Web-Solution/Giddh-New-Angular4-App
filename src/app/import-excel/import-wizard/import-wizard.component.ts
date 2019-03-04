import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';
import { ImportExcelRequestStates, ImportExcelState } from '../../store/import-excel/import-excel.reducer';
import { ImportExcelRequestData, ImportExcelResponseData } from '../../models/api-models/import-excel';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';

interface DataModel {
  field: string;
  options: IOption[];
  selected: string;
}

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
  public mappedData: ImportExcelResponseData;
  public dataModel: DataModel[];

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _importActions: ImportExcelActions,
    private _cdRef: ChangeDetectorRef
  ) {
  }

  public dataChanged = (excelState: ImportExcelState) => {
    this.excelState = excelState;
    if (excelState.requestState === ImportExcelRequestStates.UploadFileSuccess) {
      this.step++;
      this.onNext(excelState.importExcelData);
      this.prepareDataModel(excelState.importExcelData);
    }
    if (excelState.requestState === ImportExcelRequestStates.ProcessImportSuccess) {
      this._router.navigate(['/pages/import/select']);
    }
    this.isUploadInProgress = excelState.requestState === ImportExcelRequestStates.UploadFileInProgress;
  }

  public ngOnInit() {
    this._activatedRoute.url.subscribe(p => this.entity = p[0].path);
    this.store.select(p => p.importExcel)
      .subscribe(this.dataChanged);
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

  public onNext(importData: ImportExcelResponseData) {
    this.mappedData = importData;
    this._cdRef.detectChanges();
  }

  public onBack() {
    this.step--;
  }

  public onSubmit(data: ImportExcelRequestData) {
    this.store.dispatch(this._importActions.processImportRequest(this.entity, data));
  }

  private prepareDataModel(value: ImportExcelResponseData) {
    const options: IOption[] = value.headers.items.map(p => ({value: p.columnNumber, label: p.columnHeader}));
    Object.keys(value.mappings.mappingInfo).forEach(p => value.mappings.mappingInfo[p][0].isSelected = true);
    this.dataModel = Object.keys(value.mappings.mappingInfo)
      .map(field => ({
        field,
        options,
        selected: value.mappings.mappingInfo[field][0].columnNumber.toString()
      }));
  }
}
