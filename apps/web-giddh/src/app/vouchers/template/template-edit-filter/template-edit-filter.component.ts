import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { cloneDeep } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';
import { CommonService } from '../../../services/common.service';
import { ToasterService } from '../../../services/toaster.service';
import { TemplateDesignUISectionVisibility } from '../../../invoice/templates/edit-template/filters-container/design-filters/design.filters.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';

@Component({
  selector: 'app-template-edit-filter',
  templateUrl: './template-edit-filter.component.html',
  styleUrls: ['./template-edit-filter.component.scss'],

})
export class TemplateEditFilterComponent implements OnInit {
  @Input() public design: boolean;
  @Input() public mode: string = 'create';
  public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  public templateUISectionVisibility: TemplateDesignUISectionVisibility = new TemplateDesignUISectionVisibility();
  public logoAttached: boolean = false;
  public showLogo: boolean = true;
  public selectedTemplateUniqueName: string = 'gst_template_a';
  public _presetFonts = [
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Inter', value: 'Inter' }
  ];
  public _presetFontsSize = [
    { label: '16px', value: 16 },
    { label: '14px', value: 14 },
    { label: '12px', value: 12 },
    { label: '10px', value: 10 }

  ];
  public presetFonts = this._presetFonts;
  public presetFontsSize = this._presetFontsSize;
  public formData: FormData;
  public files: any[] = [];
  public dragOver: boolean;
  public imagePreview: any;
  public isFileUploaded: boolean = false;
  public isFileUploadInProgress: boolean = false;
  public sampleTemplates: CustomTemplateResponse[];
  public companyUniqueName: string = '';
  public templateType: any;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public showDeleteButton: boolean = false;
  /** fileinput element ref for clear value after remove attachment **/
  @ViewChild('fileInput', { static: false }) public logoFile: ElementRef;
  public selectedFont: string = "";
  public selectedFontSize: string = "";
  /** Default image size */
  public defaultImageSize: string = 'S';
  /** Stores the active company name */
  public companyName: string;
  public templateForm: FormGroup;
  @Input() public inputData: any;
  public imageSizes = [
    { label: 'S', value: 'S', px: '60' },
    { label: 'M', value: 'M', px: '80' },
    { label: 'L', value: 'L', px: '100' }
  ];


  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private toasty: ToasterService,
    private store: Store<AppState>,
    private commonService: CommonService,
    private invoiceUiDataService: InvoiceUiDataService) {

  }

  ngOnInit() {
    this.templateType = this.inputData?.voucherType;
    this.sampleTemplates = this.inputData?.templateList;
    this.getAccountContents();
    this.initForm();
    let companyUniqueName = null;
    let companies = null;
    this.store.pipe(select(state => state.session), take(1)).subscribe(session => {
      companyUniqueName = session.companyUniqueName;
      companies = session.companies;
      this.companyUniqueName = session.companyUniqueName;
      this.companyName = session.companies.find((company) => company?.uniqueName === session.companyUniqueName)?.name ?? '';
    });
    console.log(this.inputData, this.customTemplate, this.templateForm.value);
    this.invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, this.inputData.defaultTemplate);

    this.files = []; // local uploading files array
    this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = cloneDeep(template);
      this.setFontAndFontSize();

      let op = {
        header: {},
        table: {},
        footer: {}
      };


      if (this.customTemplate && this.customTemplate.sections) {
        op.header = this.customTemplate.sections.header.data;
        op.table = this.customTemplate.sections.table.data;
        op.footer = this.customTemplate.sections.footer.data;

        this.invoiceUiDataService.setFieldsAndVisibility(op);
        if (this.customTemplate.logoSize) {
          this.defaultImageSize = this.customTemplate.logoSize === '100' ? 'L' :
            this.customTemplate.logoSize === '80' ? 'M' : 'S';
        }
        if (this.customTemplate.logoUniqueName) {
          this.logoAttached = true;
          this.isFileUploaded = false;
          if (!this.invoiceUiDataService.isLogoUpdateInProgress) {
            this.showDeleteButton = true;
            let preview: any = document.getElementById('logoImage');
            preview?.setAttribute('src', ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName);
          }
        }
      }
    });

    this.invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
      if (!path) {
        this.showDeleteButton = false;
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.defaultImageSize = 'S';
        const preview: any = document.getElementById('logoImage');
        preview?.setAttribute('src', '');
      }
    });
    // this.templateForm.setValue(this.customTemplate);
  }

  public getAccountContents() {
    // this.invoiceService.getEmailContentSuggestions('account').pipe(takeUntil(this.destroyed$)).subscribe((res) => {
    //   this.accountSuggestions = res.body;
    // });
  }


  public initForm(): void {
    this.templateForm = this.fb.group({
      createdBy: this.fb.group({
        name: [''],
        email: [''],
        uniqueName: [''],
        mobileNo: ['']
      }),
      uniqueName: [''],
      fontSize: [''],
      fontMedium: [''],
      fontLarge: [''],
      fontDefault: [''],
      fontSmall: [''],
      createdAt: [''],
      updatedAt: [''],
      updatedBy: this.fb.group({
        name: [''],
        email: [''],
        uniqueName: [''],
        mobileNo: ['']
      }),
      sample: [''],
      templateColor: ['#AB1F00'],
      tableColor: ['#AB1F00'],
      font: [''],
      topMargin: [0],
      leftMargin: [0],
      rightMargin: [0],
      bottomMargin: [0],
      logoPosition: [''],
      logoSize: [''],
      isDefault: [false],
      isDefaultForVoucher: [false],
      showSectionsInline: [false],
      sections: [''], // You may want to use a nested group if ISection is complex
      name: [''],
      copyFrom: [''],
      logoUniqueName: [''],
      templateType: [''],
      type: [''],
      showBankQrCode: [false],
      qrCodeId: [''],
      defaultImageSize: ['']
    });
  }


  /**
   * onDesignChange
   */
  public onDesignChange(fieldName: string, value: string) {
    let template: CustomTemplateResponse;
    if (fieldName === 'uniqueName') { // change whole template
      const selectedTemplate = cloneDeep(this.sampleTemplates.find((t: CustomTemplateResponse) => (t?.uniqueName === value)));
      template = selectedTemplate ? selectedTemplate : cloneDeep(this.customTemplate);
      if (this.mode === 'update' && selectedTemplate) {
        template.uniqueName = cloneDeep(this.customTemplate?.uniqueName);
        template.name = cloneDeep(this.customTemplate.name);
      }
    } else { // change specific field
      template = cloneDeep(this.customTemplate);
      template[fieldName] = value;
    }
    template.copyFrom = cloneDeep(value);
    this.selectedTemplateUniqueName = value;
    template.sections['header'].data['companyName'].label = this.companyName;
    template.sections['footer'].data['companyName'].label = this.companyName;
    this.invoiceUiDataService.setCustomTemplate(cloneDeep(template));
  }


  public setFontAndFontSize() {
    if (this.customTemplate) {
      if (this.customTemplate.font) {
        if (this.customTemplate.templateType === 'tally_template') {
          this.presetFonts = [
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Roboto', value: 'Roboto' }
          ];
        } else {
          this.presetFonts = this._presetFonts;
        }

        this.presetFonts.map(font => {
          if (font?.value === this.customTemplate.font) {
            this.selectedFont = font.label;
          }
        });
      }

      if (this.customTemplate.fontSize) {
        this.presetFontsSize.map(fontSize => {
          if (fontSize?.value == this.customTemplate.fontSize) {
            this.selectedFontSize = fontSize.label;
          }
        });
      }
    }
  }

  /**
   * Uploads logo
   *
   * @memberof DesignFiltersContainerComponent
   */
  public uploadLogo(): void {
    let file = null;
    let selectedFile: any = null;
    selectedFile = document.getElementById("logo-edit");
    if (selectedFile?.files?.length) {
      file = selectedFile?.files[0];

      this.generalService.getSelectedFile(file, (blob, file) => {
        this.isFileUploadInProgress = true;
        this.invoiceUiDataService.isLogoUpdateInProgress = true;
        this.previewFile(file);

        this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
          this.isFileUploadInProgress = false;
          if (response?.status === 'success') {
            this.showDeleteButton = true;
            this.onValueChange('logoUniqueName', response.body?.uniqueName);
            this.isFileUploaded = true;
            this.invoiceUiDataService.isLogoUpdateInProgress = false;
            this.toasty.successToast('File uploaded successfully.');
          } else {
            this.toasty.showSnackBar("error", response.message);
          }
        });
      });
    }
  }

  public previewFile(file: any) {
    let preview: any = document.getElementById('logoImage');
    let reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
      this.invoiceUiDataService.setLogoPath(preview.src);
    };

    if (file) {
      reader.readAsDataURL(file);
      this.logoAttached = true;
    } else {
      preview.src = '';
      this.logoAttached = false;
      this.invoiceUiDataService.setLogoPath('');
    }
  }

  /**
     * onValueChange
     */
  public onValueChange(fieldName: string, value: string): void {
    let template = cloneDeep(this.customTemplate);
    if (fieldName) {
      template[fieldName] = value;
    }
    this.invoiceUiDataService.setCustomTemplate(template);
  }

  public toogleLogoVisibility(show?: boolean): void {
    if (!this.isFileUploaded) {
      this.showLogo = show ? show : !this.showLogo;
      this.invoiceUiDataService.setLogoVisibility(this.showLogo);
    }
  }

  public deleteLogo(): void {
    this.onValueChange('logoUniqueName', null);
    this.invoiceUiDataService.setLogoPath('');
    this.files = []; // local uploading files array
    this.logoAttached = false;
    this.isFileUploaded = false;
    this.isFileUploadInProgress = false;
    this.showDeleteButton = false;
    if (this.logoFile && this.logoFile.nativeElement) {
      this.logoFile.nativeElement.value = "";
    }
  }

  public changeColor(primaryColor: string, secondaryColor: string): void {
    let template = cloneDeep(this.customTemplate);
    this.templateForm.get('templateColor').setValue(primaryColor);
    this.templateForm.get('tableColor').setValue(secondaryColor);
    template.templateColor = primaryColor;
    template.tableColor = secondaryColor;
    this.invoiceUiDataService.setCustomTemplate(template);
}



}
