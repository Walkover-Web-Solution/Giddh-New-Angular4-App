import { take } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs';
import * as _ from '../../../../lodash-optimized';
import { CustomTemplateResponse } from '../../../../models/api-models/Invoice';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../services/invoice.ui.data.service';

// import { IsDivVisible, IsFieldVisible } from '../filters-container/content-filters/content.filters.component';

@Component({
  selector: 'invoice-template',
  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit, OnDestroy {

  @Input() public isPreviewMode: boolean = false;
  public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
  public logoSrc: string;
  public showLogo: boolean = true;
  public showCompanyName: boolean;
  public companyGSTIN: string;
  public companyPAN: string;
  public fieldsAndVisibility: any;
  public companyUniqueName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _invoiceUiDataService: InvoiceUiDataService) {
    let companyUniqueName = null;
    let companies = null;
    let defaultTemplate = null;

    this.store.select(s => s.session).pipe(take(1)).subscribe(ss => {
      companyUniqueName = ss.companyUniqueName;
      companies = ss.companies;
      this.companyUniqueName = ss.companyUniqueName;
    });

    this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
      defaultTemplate = ss.defaultTemplate;
    });
    this._invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);
  }

  public ngOnInit() {

    this._invoiceUiDataService.fieldsAndVisibility.subscribe((obj) => {
      this.fieldsAndVisibility = _.cloneDeep(obj);
    });

    this._invoiceUiDataService.logoPath.subscribe((path: string) => {
      this.logoSrc = _.cloneDeep(path);
    });

    this._invoiceUiDataService.isLogoVisible.subscribe((yesOrNo: boolean) => {
      this.showLogo = _.cloneDeep(yesOrNo);
    });

    this._invoiceUiDataService.customTemplate.subscribe((template: CustomTemplateResponse) => {
      if (template && template.logoUniqueName) {
        this.showLogo = true;
        this.logoSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName;
      }
      this.inputTemplate = _.cloneDeep(template);
    });

    this._invoiceUiDataService.isCompanyNameVisible.subscribe((yesOrNo: boolean) => {
      this.showCompanyName = _.cloneDeep(yesOrNo);
    });

    this.companyGSTIN = this._invoiceUiDataService.companyGSTIN.getValue();
    this.companyPAN = this._invoiceUiDataService.companyPAN.getValue();

    if (this.isPreviewMode) {
      this.templateUISectionVisibility = {
        header: true,
        table: true,
        footer: true
      };
    } else {
      this._invoiceUiDataService.selectedSection.subscribe((info: TemplateContentUISectionVisibility) => {
        this.templateUISectionVisibility = _.cloneDeep(info);
      });
    }
  }

  public onClickSection(sectionName: string) {
    if (!this.isPreviewMode) {
      this._invoiceUiDataService.setSelectedSection(sectionName);
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
