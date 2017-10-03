import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
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
  // Current company real values
  public companyGSTIN: BehaviorSubject<string> = new BehaviorSubject(null);
  public companyPAN: BehaviorSubject<string> = new BehaviorSubject(null);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  private companyName: string;
  private companyAddress: string;

  constructor(private store: Store<AppState>) {
    this.initCustomTemplate();
  }

  /**
   * initCustomTemplate
   */
  public initCustomTemplate() {
    this.isLogoVisible.next(true);
    this.store.select(p => p.session).subscribe(session => {
      if (session) {
        let uniqueName = session.companyUniqueName;
        let currentCompany = session.companies.find((company) => company.uniqueName === uniqueName);
        if (currentCompany) {
          this.companyName = currentCompany.name;
          this.companyAddress = currentCompany.address;
          if (currentCompany.gstDetails[0]) {
            this.companyGSTIN.next(currentCompany.gstDetails[0].gstNumber);
          }
          if (currentCompany.panNumber) {
            this.companyPAN.next(currentCompany.panNumber);
          }
        }
      }
    });
    this.isCompanyNameVisible.next(true);
    this.store.select(p => p.invoiceTemplate).subscribe((data) => {
      if (data && data.defaultTemplate) {
        let defaultTemplate = _.cloneDeep(data.defaultTemplate);
        if (this.companyName) {
          defaultTemplate.sections[0].content[0].label = this.companyName;
          defaultTemplate.sections[2].content[10].label = this.companyName;
        }
        if (this.companyAddress) {
          defaultTemplate.sections[2].content[8].label = this.companyAddress;
        }
        this.customTemplate.next(_.cloneDeep(defaultTemplate));
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

   public BRToNewLine(template) {
    template.sections[2].content[5].label = template.sections[2].content[5].label.replace(/<br\s*[\/]?>/gi, '\n');
    template.sections[2].content[6].label = template.sections[2].content[6].label.replace(/<br\s*[\/]?>/gi, '\n');
    template.sections[2].content[10].label = template.sections[2].content[10].label.replace(/<br\s*[\/]?>/gi, '\n');
    return template;
  }

  /**
   * setTemplateUniqueName
   */
  public setTemplateUniqueName(uniqueName: string, mode: string) {
    this.store.select(p => p.invoiceTemplate).subscribe((data) => {
      if (data && data.customCreatedTemplates && data.customCreatedTemplates.length) {
        let allTemplates = _.cloneDeep(data.customCreatedTemplates);
        let selectedTemplate = allTemplates.find((template) => template.uniqueName === uniqueName);

        if (selectedTemplate) {

          if (mode === 'create' && selectedTemplate.sections[0].content[9].field !== 'trackingNumber' && data.defaultTemplate) { // this is default(old) template
            selectedTemplate.sections = _.cloneDeep(data.defaultTemplate.sections);
          }

          if (selectedTemplate.sections[0].content[0].display) {
            this.isCompanyNameVisible.next(true);
          }
          if (this.companyName && mode === 'create') {
            selectedTemplate.sections[2].content[10].label = this.companyName;
          }
          if (this.companyAddress && mode === 'create') {
            selectedTemplate.sections[2].content[8].label = this.companyAddress;
          }
          selectedTemplate.sections[0].content[0].label = this.companyName;
          if (!selectedTemplate.logoUniqueName) {
            this.isLogoVisible.next(false);
          } else {
            this.isLogoVisible.next(true);
          }
          selectedTemplate = this.BRToNewLine(selectedTemplate);
          this.customTemplate.next(_.cloneDeep(selectedTemplate));
        }
      }
    });
  }
}
