// import { Component, OnInit, EventEmitter } from '@angular/core';
// import * as _ from 'lodash';
// import { Font } from 'ngx-font-picker/dist';
// import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
//
// @Component({
//   templateUrl: './invoice.settings.component.html'
// })
// export class InvoiceSettingsComponent {
//   public _presetFonts = [];
//   public formData: FormData;
//   public files: UploadFile[];
//   public uploadInput: EventEmitter<UploadInput>;
//   public humanizeBytes: any;
//   public dragOver: boolean;
//
//   public font: Font = new Font({
//     family: 'Roboto',
//     size: '14px',
//     style: 'regular',
//     styles: ['regular']
//   });
//
//   private sizeSelect: boolean = true;
//   private styleSelect: boolean = true;
//
//   private presetFonts = this._presetFonts;
//
//   constructor() {
//     this.files = []; // local uploading files array
//     this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
//     this.humanizeBytes = humanizeBytes;
//   }
//
//   public togglePresetFonts() {
//     this.presetFonts = this.presetFonts.length ? [] : this._presetFonts;
//   }
//
//   public toggleExtraOptions() {
//     this.sizeSelect = !this.sizeSelect;
//     this.styleSelect = !this.styleSelect;
//   }
//
//   public onUploadOutput(output: UploadOutput): void {
//     if (output.type === 'allAddedToQueue') { // when all files added in queue
//       // uncomment this if you want to auto upload files when added
//       // const event: UploadInput = {
//       //   type: 'uploadAll',
//       //   url: '/upload',
//       //   method: 'POST',
//       //   data: { foo: 'bar' },
//       //   concurrency: 0
//       // };
//       // this.uploadInput.emit(event);
//     } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
//       this.files.push(output.file);
//     } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
//       // update current data in files array for uploading file
//       const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
//       this.files[index] = output.file;
//     } else if (output.type === 'removed') {
//       // remove file from array when removed
//       this.files = this.files.filter((file: UploadFile) => file !== output.file);
//     } else if (output.type === 'dragOver') {
//       this.dragOver = true;
//     } else if (output.type === 'dragOut') {
//       this.dragOver = false;
//     } else if (output.type === 'drop') {
//       this.dragOver = false;
//     }
//   }
//
//   public startUpload(): void {
//     const event: UploadInput = {
//       type: 'uploadAll',
//       url: 'http://ngx-uploader.com/upload',
//       method: 'POST',
//       data: { foo: 'bar' },
//       // concurrency: this.formData.concurrency
//     };
//
//     this.uploadInput.emit(event);
//   }
//
//   public cancelUpload(id: string): void {
//     this.uploadInput.emit({ type: 'cancel', id: id });
//   }
//
//   public removeFile(id: string): void {
//     this.uploadInput.emit({ type: 'remove', id: id });
//   }
//
//   public removeAllFiles(): void {
//     this.uploadInput.emit({ type: 'removeAll' });
//   }
// }

import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  templateUrl: './invoice.settings.component.html'
})
export class InvoiceSettingComponent implements OnInit {

  constructor() {
    console.log('Hello');
  }

  public ngOnInit() {
    console.log('from InvoiceSettingComponent');
  }
}
