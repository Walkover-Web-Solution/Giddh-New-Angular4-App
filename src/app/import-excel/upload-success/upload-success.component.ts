import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { saveAs } from 'file-saver';
import { UploadExceltableResponse } from 'app/models/api-models/import-excel';
import { base64ToBlob } from 'app/shared/helpers/helperFunctions';

@Component({
  selector: 'upload-success',
  styleUrls: ['./upload-success.component.scss'],
  templateUrl: './upload-success.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class UploadSuccessComponent implements OnInit, OnDestroy, OnChanges {
  // @Input() public isLoading: boolean;
  @Input() public UploadExceltableResponse: UploadExceltableResponse;
  @Output() public onShowReport: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public onContinueUpload = new EventEmitter();
  public file: File = null;
  public selectedFileName: string = '';
  public selectedType: string = '';

  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }

  public downloadImportFile() {
    // change this logic after api is updated
    // let rowsCount = this.UploadExceltableResponse.failureCount + this.UploadExceltableResponse.successCount;
    // if (rowsCount > 400) {
    //   this.onShowReport.emit(true);
    // } else {
      if (!this.UploadExceltableResponse.message && this.UploadExceltableResponse.response) {
        let blob = base64ToBlob(this.UploadExceltableResponse.response, 'application/vnd.ms-excel', 512);
        return saveAs(blob, `walkover.xlsx`);
      }
    // }
  }

}
