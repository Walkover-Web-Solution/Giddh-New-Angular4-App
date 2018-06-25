import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { SettingsLinkedAccountsService } from '../../../services/settings.linked.accounts.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { decimalDigits } from '../../../shared/helpers';

@Component({
  selector: 'connect-bank-modal',
  templateUrl: './connect.bank.modal.component.html',
  styles: [`iframe {
              width: 100%;
              height: 400px;
          }
          .connect-page .page-title {
                margin-top: 0;
          }`]
})

export class ConnectBankModalComponent implements OnChanges {

  @Input() public sourceOfIframe: string;
  @Output() public modalCloseEvent: EventEmitter<boolean> = new EventEmitter(false);

  public url: SafeResourceUrl = null;

  public iframeSrc: string = '';
  public isIframeLoading: boolean = false;
  public dataSource: any;
  public dataSourceBackup: any;
  public selectedProvider: any = {};
  public step: number = 1;
  public loginForm: FormGroup;
  constructor(public sanitizer: DomSanitizer,
  private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
  private _fb: FormBuilder
  ) {
    this.dataSource = (text$: Observable<any>): Observable<any> => {
      return text$
        .debounceTime(300)
        .distinctUntilChanged()
        .switchMap((term: string) => {
          if (term.startsWith(' ', 0)) {
            return [];
          }
          return this._settingsLinkedAccountsService.SearchBank(this.selectedProvider.name).catch(e => {
            return [];
          });
        })
        .map((res) => {
          if (res.status === 'success') {
            console.log(res);
            let data = res.body.provider;
            this.dataSourceBackup = res;
            return data;
          }
        });
    };

    this.loginForm = this._fb.group({
      id: ['', Validators.required],
      forgotPasswordUrL: [''],
      loginHelp: [''],
      formType: ['', Validators.required],
      row: this._fb.array([
        this.rowArray()
      ]),
    });
  }

  public ngOnChanges(changes) {
    this.isIframeLoading = true;
    if (changes.sourceOfIframe.currentValue) {
      this.iframeSrc = this.sourceOfIframe;
      this.isIframeLoading = false;
      this.getIframeUrl(this.iframeSrc);
    }
  }
  public getIframeUrl(path) {
    if (!this.url) {
      this.url =  this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
  }
  public onCancel() {
    this.modalCloseEvent.emit(true);
    this.iframeSrc = undefined;
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    setTimeout(() => {
      if (e.item) {
        this.selectedProvider = e.item;
      }
      console.log(e);
    }, 400);
  }

  // initial unitandRates controls
  public rowArray() {
    // initialize our controls
    return this._fb.group({
      id: [''],
      label: [''],
      form: [''],
      fieldRowChoice: [''],
      field: this._fb.array([
        this.fieldArray()
      ]),
    });
  }

  public fieldArray() {
    // initialize our controls
    return this._fb.group({
      id: [''],
      name: [''],
      maxLength: [''],
      type: [''],
      value: [''],
      isOptional: [false],
      valueEditable: [true]
    });
  }

  public onSelectProvider() {
    console.log(this.selectedProvider);
    this.step = 2;
    this.getProviderLoginForm();
  }

  /**
   * getProviderLoginForm
   */
  public getProviderLoginForm() {
    this._settingsLinkedAccountsService.GetLoginForm(1).subscribe(a => {
      if (a && a.status === 'success') {
        console.log(a);
        // this.loginFormObj = _.cloneDeep(a);
        this.loginForm.patchValue(a.body.loginForm[0]);
        console.log(this.loginForm.value);
      }
    });
  }
}
