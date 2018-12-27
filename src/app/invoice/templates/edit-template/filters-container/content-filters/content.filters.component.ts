
import { ToasterService } from './../../../../../services/toaster.service';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import * as _ from '../../../../../lodash-optimized';
import { ReplaySubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';
import { Configuration } from './../../../../../app.constant';
import { UploaderOptions, UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import {ViewChild, ElementRef} from '@angular/core';
import { INVOICE_API } from 'app/services/apiurls/invoice';

@Component({
  selector: 'content-selector',
  templateUrl: 'content.filters.component.html',
  styleUrls: ['content.filters.component.css']
})

export class ContentFilterComponent implements OnInit, OnDestroy {

  @Input() public content: boolean;
  public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
  public showTransportField: boolean = true;
  public showCustomField: boolean = true;
  public showCompanyName: boolean;
  public fieldsAndVisibility: any;
  public voucherType = '' ;
  public formData: FormData;
  public signatureSrc: string;
  public fileUploadOptions: UploaderOptions;
  public signatureImgAttached: boolean = false;
  public uploadInput: EventEmitter<UploadInput>;
  public files: UploadFile[] = [];
  public humanizeBytes: any;
  public dragOver: boolean;
  public imagePreview: any;
  public isFileUploaded: boolean = false;
  public isFileUploadInProgress: boolean = false;
  public companyUniqueName = null;
  public sessionId$: Observable<string>;
  public companyUniqueName$: Observable<string>;
  @ViewChild('signatureImg') public signatureImgzRef: ElementRef<HTMLInputElement>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
 

  constructor(private store: Store<AppState>, private _invoiceUiDataService: InvoiceUiDataService,
    private _activatedRoute: ActivatedRoute, private _toasty: ToasterService
    ) {
    let companies = null;
    let defaultTemplate = null;

    this.store.select(s => s.session).pipe(take(1)).subscribe(ss => {
      this.companyUniqueName = ss.companyUniqueName;
      companies = ss.companies;
    });

    this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
      defaultTemplate = ss.defaultTemplate;
    });
    this._invoiceUiDataService.initCustomTemplate(this.companyUniqueName, companies, defaultTemplate);

    this.sessionId$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
    this.companyUniqueName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {

    this._activatedRoute.params.subscribe(a => {
      if (!a) {
        return;
      }
      this.voucherType = a.voucherType;
      // this.getVoucher(false);
    });
    this._invoiceUiDataService.customTemplate.subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = _.cloneDeep(template);

    console.log('custom Tmp..',this.customTemplate);
    });

    this._invoiceUiDataService.selectedSection.subscribe((info: TemplateContentUISectionVisibility) => {
      this.templateUISectionVisibility = _.cloneDeep(info);
    });

    this._invoiceUiDataService.isCompanyNameVisible.subscribe((yesOrNo: boolean) => {
      this.showCompanyName = _.cloneDeep(yesOrNo);
    });

    this._invoiceUiDataService.fieldsAndVisibility.subscribe((obj) => {
      this.fieldsAndVisibility = _.cloneDeep(obj);
    });

    this.fileUploadOptions = {concurrency: 1, allowedContentTypes: ['image/png', 'image/jpeg']};
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    
  }

  /**
   * onFieldChange
   */
  public onFieldChange(sectionName: string, fieldName: string, value: string) {
    let template = _.cloneDeep(this.customTemplate);
    if (sectionName && fieldName && value) {
      let sectionIndx = template.sections.findIndex((sect) => sect.sectionName === sectionName);
      if (sectionIndx > -1) {
        template.sections[sectionIndx].content[fieldName] = value;
        let fieldIndx = template.sections[sectionIndx].content.findIndex((fieldObj) => fieldObj.field === fieldName);
        if (fieldIndx > -1) {
          template.sections[sectionIndx].content[fieldIndx].label = value;
        }
      }
    }

    this._invoiceUiDataService.setCustomTemplate(template);
  }

  /**
   * onChangeFieldVisibility
   */
  public onChangeFieldVisibility(sectionName: string, fieldName: string, value: boolean) {
    let template = _.cloneDeep(this.customTemplate);
    console.log('onChangeFieldVisibility...', template);
    this._invoiceUiDataService.setCustomTemplate(template);
  }

  /**
   * onChangeCompanyNameVisibility
   */
  public onChangeCompanyNameVisibility() {
    this._invoiceUiDataService.setCompanyNameVisibility(this.showCompanyName);
  }

  public ngOnDestroy() {
    // this._invoiceUiDataService.customTemplate.unsubscribe();
    // this._invoiceUiDataService.selectedSection.unsubscribe();
    // this.destroyed$.next(true);
    // this.destroyed$.complete();
  }

  public onUploadFileOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      // this.logoAttached = true;
      this.signatureImgAttached = true;
      this.signatureImgAttached = true;
       this.previewFile(output.file);
       this.startUpload();

    } else if (output.type === 'start') {
      //
    } else if (output.type === 'done') {
      // this.isFileUploadInProgress = false;
      this.signatureImgAttached = true;
      if (output.file.response.status === 'success') {
        this.customTemplate.sections.footer.data.imageSignature.label = output.file.response.body.uniqueName;
        this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + output.file.response.body.uniqueName;
        // this.customTemplate.sections.footer.data.imageSignature.label = this.signatureSrc;
        this.onChangeFieldVisibility(null, null, null);
        // this.isFileUploaded = true;
        this._toasty.successToast('file uploaded successfully.');
        this.startUpload();
      } else {
        this._toasty.errorToast(output.file.response.message, output.file.response.code);
      }
    }
  }


  public startUpload(): void {
    let sessionId = null;
    let companyUniqueName = null;
     this.sessionId$.pipe(take(1)).subscribe(a => sessionId = a);
   this.companyUniqueName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
    const event: UploadInput = {
      type: 'uploadAll',
      url: Configuration.ApiUrl + INVOICE_API.UPLOAD_LOGO.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)),
      method: 'POST',
      headers: {'Session-Id': sessionId},
    };

    this.uploadInput.emit(event);
  }

  public previewFile(files: any) {
    let preview: any = document.getElementById('signatureImage');
    let a: any = document.querySelector('input[type=file]');
    let file = a.files[0];
    let reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
      this._invoiceUiDataService.setLogoPath(preview.src);
    };
    if (file) {
      reader.readAsDataURL(file);
      // this.logoAttached = true;
    } else {
      preview.src = '';
      // this.logoAttached = false;
      this._invoiceUiDataService.setLogoPath('');
    }
  }

  public cancelUpload(id: string): void {
    this.uploadInput.emit({type: 'cancel', id});
  }

  public removeFile(id: string): void {
    this.uploadInput.emit({type: 'remove', id});
  }

  public removeAllFiles(): void {
    this.uploadInput.emit({type: 'removeAll'});
  }

  

  /**
   * deleteLogo
   */
  public deleteLogo() {
    // this.onValueChange('logoUniqueName', null);
    this._invoiceUiDataService.setLogoPath('');
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    // this.logoAttached = false;
    this.isFileUploaded = false;
    this.isFileUploadInProgress = false;
    this.removeAllFiles();
  }

  /**
   * chooseSigntureType
   */
  public chooseSigntureType(val) {
    console.log('chooseSigntureType...', val);
    if (val === 'slogan') {
      this.customTemplate.sections.footer.data.slogan.display = true;
      this.customTemplate.sections.footer.data.imageSignature.display = false;
     this.signatureImgAttached = false;
     this.signatureSrc = '';
    this.signatureImgzRef.nativeElement.value = null;
      } else {
      this.customTemplate.sections.footer.data.imageSignature.display = true;
      this.customTemplate.sections.footer.data.slogan.display = false;
     
    }
  }
}
