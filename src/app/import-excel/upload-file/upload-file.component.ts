import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { saveAs } from 'file-saver';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'upload-file',
  styleUrls: ['./upload-file.component.scss'],
  templateUrl: './upload-file.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class UploadFileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public isLoading: boolean;
  @Input() public entity: string;
  @Output() public onFileUpload = new EventEmitter();
  public file: File = null;
  public selectedFileName: string = '';
  public selectedType: string = '';

  constructor(private _toaster: ToasterService) {
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

  public onFileChange(file: FileList) {
    // let validExts = ['csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    //
    // let type = file.item(0).type;
    // let isValidFileType = validExts.some(s => type === s);
    //
    // if (!isValidFileType) {
    //   this._toaster.errorToast('Only XLS files are supported for Import');
    //   this.selectedFileName = '';
    //   this.file = null;
    //   return;
    // }

    this.file = file.item(0);
    if (this.file) {
      this.selectedFileName = this.file.name;
    } else {
      this.selectedFileName = '';
    }
  }

  public async downloadSampleFile(entity: string) {
    const fileUrl = `assets/sample-files/${entity}-sample.xlsx`;
    const fileName = `${entity}-sample.xlsx`;
    try {
      let blob = await fetch(fileUrl).then(r => r.blob());
      saveAs(blob, fileName);
    } catch (e) {
      console.log('error while downloading sample file :', e);
    }
  }
}
