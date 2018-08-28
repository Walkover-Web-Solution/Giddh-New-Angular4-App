import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewEncapsulation, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import * as _ from 'lodash';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../services/invoice.ui.data.service';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';
import { Observable } from '../../../../../../../../node_modules/rxjs/Observable';
import { SettingsProfileActions } from 'app/actions/settings/profile/settings.profile.action';
import { AppState } from 'app/store';

@Component({
  selector: 'gst-template-b',
  templateUrl: './gst-template-b.component.html',
  styleUrls: ['./gst-template-b.component.css'],
  encapsulation: ViewEncapsulation.Native
})

export class GstTemplateBComponent implements OnInit, OnDestroy, OnChanges {
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
  public theadCount: number = 0;
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

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    if (s && s['fieldsAndVisibility'] && s['fieldsAndVisibility'].firstChange) {
      this.countTableDisplay(s.fieldsAndVisibility.currentValue.table);
    }
    console.log(s);
  }

  /**
   * countTableDisplay
   */
  public countTableDisplay(table) {
    console.log(table);
    let count =  _.countBy(table, (thead: any) => {
      return thead.display;
    });
    console.log(count);
    this.theadCount = count.true;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
