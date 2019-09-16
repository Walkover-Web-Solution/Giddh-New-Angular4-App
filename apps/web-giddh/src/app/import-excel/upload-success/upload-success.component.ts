import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { saveAs } from 'file-saver';
import { UploadExceltableResponse } from 'apps/web-giddh/src/app/models/api-models/import-excel';
import { base64ToBlob } from 'apps/web-giddh/src/app/shared/helpers/helperFunctions';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { ImportExcelActions } from '../../actions/import-excel/import-excel.actions';

@Component({
  selector: 'upload-success',
  styleUrls: ['./upload-success.component.scss'],
  templateUrl: './upload-success.component.html',
})

export class UploadSuccessComponent implements OnDestroy {
  @Input() public UploadExceltableResponse: UploadExceltableResponse;
  @Output() public onShowReport: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public onContinueUpload = new EventEmitter();
  public file: File = null;
  public selectedType: string = '';

  constructor(private store: Store<AppState>, private _importActions: ImportExcelActions) {
    //
  }

  public downloadImportFile() {
    // rows less than 400 download report
    if (!this.UploadExceltableResponse.message && this.UploadExceltableResponse.response) {
      let blob = base64ToBlob(this.UploadExceltableResponse.response, 'application/vnd.ms-excel', 512);
      return saveAs(blob, `Import-report.csv`);
    }

    // rows grater than 400 show import report screen
    if (this.UploadExceltableResponse.message) {
      this.onShowReport.emit(true);
    }
  }

  private resetStoreData() {
    this.store.dispatch(this._importActions.resetImportExcelState());
  }

  ngOnDestroy(): void {
    this.resetStoreData();
  }

}
