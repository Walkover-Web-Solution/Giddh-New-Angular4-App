import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
// import {
//   IsDivVisible,
//   IsFieldVisible
// } from '../invoice/templates/edit-template/filters-container/content-filters/content.filters.component';
import { EmailSettingObjDefinition } from '../models/interfaces/invoice.setting.interface';
import { CustomTemplateResponse } from '../models/api-models/Invoice';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ReplaySubject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class TemplateContentUISectionVisibility {
  public header: boolean = true;
  public table: boolean = false;
  public footer: boolean = false;
}

@Injectable()

export class InvoiceUiDataService {

  public customTemplate: BehaviorSubject<CustomTemplateResponse> = new BehaviorSubject(new CustomTemplateResponse());
  public isLogoVisible: Subject<boolean> = new Subject();
  public isCompanyNameVisible: Subject<boolean> = new Subject();
  public logoPath: Subject<string> = new Subject();
  public selectedSection: Subject<TemplateContentUISectionVisibility> = new Subject();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.initCustomTemplate();
  }

  /**
   * initCustomTemplate
   */
  public initCustomTemplate() {
    this.isCompanyNameVisible.next(true);
    this.store.select(p => p.invoiceTemplate).subscribe((data) => {
      if (data && data.defaultTemplate) {
        this.customTemplate.next(_.cloneDeep(data.defaultTemplate));
      }
    });

    this.selectedSection.next({
      header: true,
      table: false,
      footer: false
    });
  }

  /**
   * setCustomTemplate
   */
  public setCustomTemplate(template: CustomTemplateResponse) {
    this.customTemplate.next(template);
  }

  /**
   * setLogoVisibility
   */
  public setLogoVisibility(value: boolean) {
    this.isLogoVisible.next(value);
  }

  /**
   * setCompanyNameVisibility
   */
  public setCompanyNameVisibility(value: boolean) {
    this.isCompanyNameVisible.next(value);
  }

  /**
   * setLogoPath
   */
  public setLogoPath(path: string) {
    this.logoPath.next(path);
  }

  /**
   * setSelectedSection
   */
  public setSelectedSection(section: string) {
    let state = {
      header: false,
      table: false,
      footer: false
    };
    state[section] = true;
    this.selectedSection.next(state);
  }

   /**
   * reloadCustomTemplate
   */
  public reloadCustomTemplate() {
    this.initCustomTemplate();
  }

  /**
   * resetCustomTemplate
   */
  public resetCustomTemplate() {
    this.customTemplate.next(new CustomTemplateResponse());
  }

  /**
   * setTemplateUniqueName
   */
  public setTemplateUniqueName(uniqueName: string) {
    // this.selectedSection.next({
    //   header: true,
    //   table: true,
    //   footer: true
    // });
    this.store.select(p => p.invoiceTemplate).subscribe((data) => {
      if (data && data.customCreatedTemplates && data.customCreatedTemplates.length) {
        let allTemplates = _.cloneDeep(data.customCreatedTemplates);
        let selectedTemplate = allTemplates.find((template) => template.uniqueName === uniqueName);
        if (selectedTemplate) {
          if (selectedTemplate.sections[0].content[0].display) {
            this.isCompanyNameVisible.next(true);
          }
          this.customTemplate.next(_.cloneDeep(selectedTemplate));
        }
      }
    });
  }

  // public templateName: string;
  // public logoPath: Subject<string> = new Subject();
  // public imageSignaturePath: Subject<string> = new Subject();
  // public setDivVisible: Subject<IsDivVisible> = new Subject();
  // public setFieldDisplay: Subject<IsFieldVisible> = new Subject();
  // public logoSize: Subject<string> = new Subject();
  // public defaultPrintSetting: Subject<number> = new Subject();
  // public showLogo: Subject<boolean> = new Subject();
  // public invoiceEmailSettingObject: EmailSettingObjDefinition = new EmailSettingObjDefinition();

  // public setLogoPath(val) {
  //   // console.log('The value is :', val);
  //   this.logoPath.next(val);
  // }

  // public setImageSignatgurePath(val) {
  //   // console.log('The value is :', val);
  //   this.imageSignaturePath.next(val);
  // }

  // public setDivStatus(div: IsDivVisible) {
  //   this.setDivVisible.next(div);
  // }

  // public setFieldDisplayState(field: IsFieldVisible) {
  //   this.setFieldDisplay.next(field);
  // }

  // public setLogoSize(size: string) {
  //   this.logoSize.next(size);
  // }
  // public resetPrintSetting(margin: number) {
  //   this.defaultPrintSetting.next(margin);
  // }
  // public logoState(state) {
  //   this.showLogo.next(state);
  // }
  // // Email
  // public updateEmailSettingObj(emailSettingObj) {
  //   this.invoiceEmailSettingObject = emailSettingObj;
  // }
  // public getEmailSettingObj() {
  //   return this.invoiceEmailSettingObject;
  // }
  // public setTemplateName(name: string) {
  //   this.templateName = name;
  // }
  // public getTemplateName() {
  //   return this.templateName;
  // }
}
