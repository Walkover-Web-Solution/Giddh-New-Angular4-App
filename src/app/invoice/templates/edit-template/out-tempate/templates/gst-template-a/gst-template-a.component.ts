import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../services/invoice.ui.data.service';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { AppState } from 'app/store';
import * as _ from 'lodash';
import { SettingsProfileActions } from '../../../../../../actions/settings/profile/settings.profile.action';

@Component({
  selector: 'gst-template-a',
  templateUrl: './gst-template-a.component.html',
  styleUrls: ['./gst-template-a.component.css']
})

export class GstTemplateAComponent implements OnInit, OnDestroy {

  @Input() public fieldsAndVisibility: any = null;
  @Input() public isPreviewMode: boolean = false;
  @Input() public showLogo: boolean = true;
  @Input() public showCompanyName: boolean;
  @Input() public companyGSTIN: string;
  @Input() public companyPAN: string;
  @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  @Input() public logoSrc: string;
  @Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();

  @Output() public sectionName: EventEmitter<string> = new EventEmitter();
  public companySetting$: Observable<any> = Observable.of(null);
  public companyAddress: string = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private settingsProfileActions: SettingsProfileActions) {
    this.companySetting$ = this.store.select(s => s.settings.profile).takeUntil(this.destroyed$);
    //
  }

  public ngOnInit() {
    this.companySetting$.subscribe( a => {
      if (a && a.address) {
        this.companyAddress = _.cloneDeep(a.address);
      } else if (!a) {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
      }
    });
    //
  }

  public onClickSection(sectionName: string) {
    if (!this.isPreviewMode) {
      this.sectionName.emit(sectionName);
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
