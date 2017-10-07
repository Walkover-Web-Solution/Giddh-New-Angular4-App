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
import { ToasterService } from '../../../../../services/toaster.service';
import { INVOICE_API } from '../../../../../services/apiurls/invoice';
import { Observable } from 'rxjs/Observable';

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
  public isFileUploaded: boolean = false;
  public isFileUploadInProgress: boolean = false;
  public sessionId$: Observable<string>;
  public companyUniqueName$: Observable<string>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _invoiceUiDataService: InvoiceUiDataService, private _toasty: ToasterService, private store: Store<AppState>) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.sessionId$ = this.store.select(p => p.session.user.session.id).takeUntil(this.destroyed$);
    this.companyUniqueName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
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
    if (fieldName) {
      template[fieldName] = value;
    }
    this._invoiceUiDataService.setCustomTemplate(template);
  }

  /**
   * changeColor
   */
  public changeColor(primaryColor: string, secondaryColor: string) {
    let template = _.cloneDeep(this.customTemplate);
    template.templateColor = primaryColor;
    template.tableColor = secondaryColor;
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

  public onUploadMyFileOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
        this.previewFile(output.file);
    } else if (output.type === 'start') {
        this.isFileUploadInProgress = true;
        this.removeAllFiles();
    } else if (output.type === 'done') {
      this.isFileUploadInProgress = false;
      if (output.file.response.status === 'success') {
        this.onValueChange('logoUniqueName', output.file.response.body.uniqueName);
        this.isFileUploaded = true;
        this._toasty.successToast('file uploaded successfully.');
      } else {
        this._toasty.errorToast(output.file.response.message, output.file.response.code);
      }
    }
  }

  public startUpload(): void {
    let sessionId = null;
    let companyUniqueName = null;
    this.sessionId$.take(1).subscribe(a => sessionId = a);
    this.companyUniqueName$.take(1).subscribe(a => companyUniqueName = a);
    const event: UploadInput = {
      type: 'uploadAll',
      url: INVOICE_API.UPLOAD_LOGO.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)),
      method: 'POST',
      headers: { 'Session-Id': sessionId },
      concurrency: 1,
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

  /**
   * deleteLogo
   */
  public deleteLogo() {
    this.onValueChange('logoUniqueName', null);
    this._invoiceUiDataService.setLogoPath('');
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.logoAttached = false;
    this.isFileUploaded = false;
    this.isFileUploadInProgress = false;
    this.removeAllFiles();
  }

   public ngOnDestroy() {
    // this._invoiceUiDataService.customTemplate.unsubscribe();
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }
}
