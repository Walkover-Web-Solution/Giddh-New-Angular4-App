import { take } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import * as _ from '../../../../../lodash-optimized';
import { ReplaySubject } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/roots';

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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _invoiceUiDataService: InvoiceUiDataService) {
    let companyUniqueName = null;
    let companies = null;
    let defaultTemplate = null;

    this.store.select(s => s.session).pipe(take(1)).subscribe(ss => {
      companyUniqueName = ss.companyUniqueName;
      companies = ss.companies;
    });

    this.store.select(s => s.invoiceTemplate).pipe(take(1)).subscribe(ss => {
      defaultTemplate = ss.defaultTemplate;
    });
    this._invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, defaultTemplate);
  }

  public ngOnInit() {
    this._invoiceUiDataService.customTemplate.subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = _.cloneDeep(template);
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
    if (sectionName && fieldName && value) {
      let sectionIndx = template.sections.findIndex((sect) => sect.sectionName === sectionName);
      if (sectionIndx > -1) {
        template.sections[sectionIndx].content[fieldName] = value;
        let fieldIndx = template.sections[sectionIndx].content.findIndex((fieldObj) => fieldObj.field === fieldName);
        if (fieldIndx > -1) {
          template.sections[sectionIndx].content[fieldIndx].display = value;
        }
      }
    }

    if (!template.sections[0].content[14].display) {
      template.sections[0].content[13].display = false;
      template.sections[0].content[15].display = false;
    }

    if (!template.sections[0].content[16].display) {
      template.sections[0].content[17].display = false;
      template.sections[0].content[18].display = false;
    }

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

}
