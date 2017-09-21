import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import * as _ from 'lodash';
import { Font } from 'ngx-font-picker/dist';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { InvoiceActions } from '../../../../../services/actions/invoice/invoice.actions';
import { InvoiceTemplatesService } from '../../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import { ReplaySubject } from 'rxjs/Rx';

export class TemplateDesignUISectionVisibility {
  public templates: boolean = false;
  public logo: boolean = false;
  public color: boolean = false;
  public font: boolean = false;
  public print: boolean = false;
}

@Component({
  selector: 'design-filters',
  templateUrl: 'design.filters.component.html',
  styleUrls: ['design.filters.component.css']
})

export class DesignFiltersContainerComponent implements OnInit, OnDestroy {
  @Input() public design: boolean;
  public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  public templateUISectionVisibility: TemplateDesignUISectionVisibility = new TemplateDesignUISectionVisibility();
  public logoAttached: boolean = false;
  public showLogo: boolean = true;

  public font: Font = new Font({
    family: 'Roboto',
    size: '14px',
    style: 'regular',
    styles: ['regular']
  });

  public _presetFonts = ['Arial', 'Serif', 'Helvetica', 'Sans-Serif', 'Open Sans', 'Roboto Slab'];
  public presetFonts = this._presetFonts;

  public formData: FormData;
  public files: UploadFile[] = [];
  public uploadInput: EventEmitter<UploadInput>;
  public humanizeBytes: any;
  public dragOver: boolean;
  public imagePreview: any;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _invoiceUiDataService: InvoiceUiDataService) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  public ngOnInit() {
    this._invoiceUiDataService.customTemplate.subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = _.cloneDeep(template);
    });
  }

  /**
   * onValueChange
   */
  public onValueChange(fieldName: string, value: string) {
    let template = _.cloneDeep(this.customTemplate);
    if (fieldName && value) {
      template[fieldName] = value;
    }
    this._invoiceUiDataService.setCustomTemplate(template);
  }

  /**
   * changeColor
   */
  public changeColor(primaryColor: string, secondaryColor: string) {
    let template = _.cloneDeep(this.customTemplate);
    template.primaryColor = primaryColor;
    template.secondaryColor = secondaryColor;
    this._invoiceUiDataService.setCustomTemplate(template);
  }

  /**
   * onDesignChange
   */
  public onDesignChange(fieldName, value) {
    let template = _.cloneDeep(this.customTemplate);
    template[fieldName] = value;
    this._invoiceUiDataService.setCustomTemplate(template);
  }

  /**
   * resetPrintSetting
   */
  public resetPrintSetting() {
     let template = _.cloneDeep(this.customTemplate);
     template.topMargin = template.bottomMargin = template.leftMargin = template.rightMargin = 10;
     this.customTemplate = _.cloneDeep(template);
     this.onValueChange(null, null);
  }

  /**
   * onFontSelect
   */
  public onFontSelect(font: Font) {
    this.onValueChange('font', font.family);
  }

  /**
   * onChangeVisibility
   */
  public onChangeVisibility(section: string) {
    let visibility = _.cloneDeep(this.templateUISectionVisibility);
    visibility.color = false;
    visibility.font = false;
    visibility.logo = false;
    visibility.print = false;
    visibility.templates = false;
    if (section) {
      visibility[section] = true;
    }
    this.templateUISectionVisibility = visibility;
  }

  public clickedOutside() {
    this.onChangeVisibility(null);
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

  public toogleLogoVisibility(): void {
    this.showLogo = !this.showLogo;
    this._invoiceUiDataService.setLogoVisibility(this.showLogo);
  }

   public ngOnDestroy() {
    // this._invoiceUiDataService.customTemplate.unsubscribe();
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }
}
