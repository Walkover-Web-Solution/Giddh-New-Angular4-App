import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import { Font } from 'ngx-font-picker/dist';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../store/roots";
import {InvoiceActions} from "../../../../../services/actions/invoice/invoice.actions";
import {InvoiceTemplatesService} from "../../../../../services/invoice.templates.service";
import {InvoiceUiDataService} from "../../../../../services/invoice.ui.data.service";
import {Observable} from "rxjs/Observable";


// import { Font } from 'ngx-font-picker';

@Component({
  selector: 'design-filters',
  templateUrl: 'design.filters.component.html'
})

export class DesignFiltersContainerComponent implements OnInit {

  // public font: Font = new Font({
  //   family: 'Roboto',
  //   size: '14px',
  //   style: 'regular',
  //   styles: ['regular']
  // });
  public formData: FormData;
  public files: UploadFile[];
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: any;
  public dragOver: boolean;
  public imagePreview: any;

  public font: Font = new Font({
    family: 'Roboto',
    size: '14px',
    style: 'regular',
    styles: ['regular']
  });
  public currentColor: string;
  public top: string;
  public left: string;
  public bottom: string;
  public right: string;
  public ifTemplateSelected: boolean = false;
  public ifLogoSelected: boolean = false;
  public ifColorSelected: boolean = false;
  public ifFontSelected: boolean = false;
  public ifPrintSelected: boolean = false;
  public sampleJsonString: string;
  @Input() public design: boolean;
  public _presetFonts = ['Arial', 'Serif', 'Helvetica', 'Sans-Serif', 'Open Sans', 'Roboto Slab'];
  public sizeSelect: boolean = true;
  public styleSelect: boolean = true;
  public presetFonts = this._presetFonts;
  constructor(private _invoiceUiDataService: InvoiceUiDataService, private store: Store<AppState>, private invoiceAction: InvoiceActions, private invoiceTemplatesService: InvoiceTemplatesService) {
    console.log('design-filters-container constructor called');
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  public ngOnInit() {
    console.log('design-filters-container initialised');
  }

  public selectTemplate() {
    this.ifTemplateSelected = true;
    this.ifLogoSelected = false;
    this.ifColorSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
  }

  public selectLogo() {
    this.ifLogoSelected = true;
    this.ifColorSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
    this.ifTemplateSelected = false;
  }

  public selectColor() {
    this.ifColorSelected = true;
    this.ifLogoSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
    this.ifTemplateSelected = false;
  }
  public selectFonts() {
    this.ifFontSelected = true;
    this.ifColorSelected = false;
    this.ifLogoSelected = false;
    this.ifPrintSelected = false;
    this.ifTemplateSelected = false;
  }

  public printSettings() {
    this.ifPrintSelected = true;
    this.ifFontSelected = false;
    this.ifColorSelected = false;
    this.ifLogoSelected = false;
    this.ifTemplateSelected = false;
  }

  public togglePresetFonts() {
    this.presetFonts = this.presetFonts.length ? [] : this._presetFonts;
  }

  public toggleExtraOptions() {
    this.sizeSelect = !this.sizeSelect;
    this.styleSelect = !this.styleSelect;
  }
  // constructor() {
  //   this.files = []; // local uploading files array
  //   this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  //   this.humanizeBytes = humanizeBytes;
  // }
  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {

      // this.previewImagem(output.nativeFile).then(response => {
      //   this.imagePreview = response;
      //   console.log(this.imagePreview);
        // The image preview

        this.files.push(output.file);
        console.log(this.files);
         this.previewFile(this.files);
       // });
      // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' },
      //   concurrency: 0
      // };
      // this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') {
      // this.previewImagem(output.nativeFile).then(response => {
      //   this.imagePreview = response;
      //   console.log(this.imagePreview);
      //   // The image preview
        this.files.push(output.file);
      } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
      console.log(this.files);
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    // public previewImagem(file: any) {
  //   const fileReader = new FileReader();
  //   return new Promise(resolve => {
  //     if (file) {
  //     fileReader.readAsDataURL(file);
  //     fileReader.onload = function(e: any) {
  //       resolve(e.target.result);
  //     };
  //     }
  //   });
  }

  public startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' },
      // concurrency: this.formData.concurrency
    };

    this.uploadInput.emit(event);
  }

   public previewFile(files: any) {
    let preview = document.querySelector('img');
    let file    = document.querySelector('input[type=file]').files[0];
    let reader  = new FileReader();
    let imgSrc$: Observable<any>;

    reader.onloadend = () => {
      preview.src = reader.result;
      this._invoiceUiDataService.setLogoPath(preview.src);
    };

    // imgSrc$.subscribe((val) => {
    //   if (val) {
    //     this._invoiceUiDataService.setLogoPath(imgSrc);
    //   }
    // });

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = ' ';
    }
  }
  public cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id });
  }

  public removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id });
  }

  public removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  public onPageMarginChange(value, margin) {
    if (margin === 'topMargin') {
      this.store.dispatch(this.invoiceAction.setTopPageMargin(value));
    }
    if (margin === 'leftMargin') {
      this.store.dispatch(this.invoiceAction.setLeftPageMargin(value));
    }
    if (margin === 'bottomMargin') {
      this.store.dispatch(this.invoiceAction.setBottomPageMargin(value));
    }
    if (margin === 'rightMargin') {
      this.store.dispatch(this.invoiceAction.setRightPageMargin(value));

    }
  }

  public showTemplate(id) {
    this.store.dispatch(this.invoiceAction.setTemplateId(id));
  }
  public onFontSelect(fo: Font) {
    this.store.dispatch(this.invoiceAction.setFont(fo.family));
  }
  public changeColor(color) {
    this.currentColor = color;
    this.store.dispatch(this.invoiceAction.setColor(color));
  }

}
