import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import { Font } from 'ngx-font-picker/dist';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { InvoiceActions } from '../../../../../services/actions/invoice/invoice.actions';
import { InvoiceTemplatesService } from '../../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';

@Component({
  selector: 'design-filters',
  templateUrl: 'design.filters.component.html',
  styleUrls: ['design.filters.component.css']
})

export class DesignFiltersContainerComponent {
  public formData: FormData;
  public files: UploadFile[] = [];
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
  public logoAttached: boolean = false;
  public logoSize: string;
  public showLogo: boolean = true;
  constructor(private _invoiceUiDataService: InvoiceUiDataService, private store: Store<AppState>, private invoiceAction: InvoiceActions, private invoiceTemplatesService: InvoiceTemplatesService) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.currentColor = '#000000';
    this.logoSize = '140';
    this._invoiceUiDataService.setLogoSize(this.logoSize);
    this._invoiceUiDataService.updateEmailSettingObj({ isEmailTabSelected: false });
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
  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      this.files.push(output.file);
      this.previewFile(this.files);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  public startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' },
    };

    this.uploadInput.emit(event);
  }

  public previewFile(files: any) {
    let preview: any = document.getElementById('logoImage');
    let a: any = document.querySelector('input[type=file]');
    let file = a.files[0];
    let reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
      this._invoiceUiDataService.setLogoPath(preview.src);
    };
    if (file) {
      reader.readAsDataURL(file);
      this.logoAttached = true;
    } else {
      preview.src = '';
      this.logoAttached = false;
      this._invoiceUiDataService.setLogoPath('');
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
  public setLogoSize(size) {
    if (size === 'small') {
      this.logoSize = '40';
    } else if (size === 'large') {
      this.logoSize = '180';
    } else {
      this.logoSize = '140';
    }
    this._invoiceUiDataService.setLogoSize(this.logoSize);
  }

  public resetPrintSetting() {
    this._invoiceUiDataService.resetPrintSetting(10);
    this.left = '';
    this.top = '';
    this.right = '';
    this.bottom = '';
  }
  public hideLogo() {
    this.showLogo = !this.showLogo;
    this._invoiceUiDataService.logoState(this.showLogo);
  }

  public clickedOutside() {
    console.log('Clicked outside');
    this.ifColorSelected = false;
    this.ifLogoSelected = false;
    this.ifPrintSelected = false;
    this.ifFontSelected = false;
    this.ifTemplateSelected = false;
  }

  /**
   * setTemplateName
   */
  public setTemplateName(name: string) {
    this._invoiceUiDataService.setTemplateName(name);
  }
}
