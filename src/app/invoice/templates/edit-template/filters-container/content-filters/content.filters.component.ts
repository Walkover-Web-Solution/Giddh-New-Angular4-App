import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { CollapseModule } from 'ngx-bootstrap';
import { AppState } from '../../../../../store/roots';
import { InvoiceActions } from '../../../../../services/actions/invoice/invoice.actions';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { Observable } from 'rxjs/Observable';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../../../services/invoice.ui.data.service';
import { InvoiceTemplatesService } from '../../../../../services/invoice.templates.service';
import { CustomTemplateResponse } from '../../../../../models/api-models/Invoice';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs/Rx';

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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _invoiceUiDataService: InvoiceUiDataService) {
    // Init sections and fields
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
