import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { SettingsLinkedAccountsService } from '../../../services/settings.linked.accounts.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { decimalDigits } from '../../../shared/helpers';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'connect-bank-modal',
  templateUrl: './connect.bank.modal.component.html',
  styles: [`iframe {
              width: 100%;
              height: 400px;
          }
          .connect-page .page-title {
                margin-top: 0;
          }
          .provider_ico {
            margin-right: 10px;
            max-width: 16px;
            max-height: 16px;
            float: left;
            object-fit: contain;
          }
          .provider_ico img {
            width: 100%;
            height: auto;
          }
          `]
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
  public bankSyncInProgress: boolean;
  public apiInInterval: any;
  public cancelRequest: boolean = false;

  constructor(public sanitizer: DomSanitizer,
    private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
    private _fb: FormBuilder,
    private _toaster: ToasterService
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
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
  }
  public onCancel() {
    this.modalCloseEvent.emit(true);
    this.iframeSrc = undefined;
    this.loginForm.reset();
    this.step = 1;
    this.selectedProvider = {};
    this.bankSyncInProgress = false;
    this.cancelRequest = true;
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    setTimeout(() => {
      if (e.item) {
        this.selectedProvider = e.item;
      }
    }, 20);
  }

  // initial rowArray controls
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
      value: [null],
      isOptional: [false],
      valueEditable: [true],
      option: []
    });
  }

  // add addInputRow controls
  public addInputRow(i: number, item) {
    const inputRowControls = this.loginForm.controls['row'] as FormArray;
    const control = this.loginForm.controls['row'] as FormArray;

    // add addInputRow to the list
    if (item) {
      if (control.controls[i]) {
        control.controls[i].patchValue(item);
      } else {
        control.push(this.rowArray());
        setTimeout(() => {
          control.controls[i].patchValue(item);
        }, 200);
      }
    } else {
      if (inputRowControls.controls[i].value.rate && inputRowControls.controls[i].value.stockUnitCode) {
        control.push(this.rowArray());
      }
    }
  }

  public onSelectProvider() {
    const inputRowControls = this.loginForm.controls['row'] as FormArray;
    if (inputRowControls.controls.length > 1) {
      inputRowControls.controls = inputRowControls.controls.splice(1);
    }
    this.getProviderLoginForm(this.selectedProvider.id);
  }

  /**
   * getProviderLoginForm
   */
  public getProviderLoginForm(providerId) {
    this._settingsLinkedAccountsService.GetLoginForm(providerId).subscribe(a => {
      if (a && a.status === 'success') {
        let response = _.cloneDeep(a.body.loginForm[0]);
        this.loginForm.patchValue({
          id: response.id,
          forgotPasswordUrL: response.forgotPasswordUrL,
          loginHelp: response.loginHelp,
          formType: response.formType,
        });
        response.row.map((item, i) => {
          this.addInputRow(i, item);
        });
        this.step = 2;
      }
    });
  }

  /**
   * onSubmitLoginForm
   */
  public onSubmitLoginForm() {
    let objToSend = {
      loginForm: []
    };
    objToSend.loginForm.push(this.loginForm.value);
    this._settingsLinkedAccountsService.AddProvider(_.cloneDeep(objToSend), this.selectedProvider.id).subscribe(res => {
      if (res.status === 'success') {
        this._toaster.successToast(res.body);
        let providerId = res.body.replace(/[^0-9]+/ig, '');
        if (providerId) {
          this.cancelRequest = false;
          this.getBankSyncStatus(providerId);
        } else {
          this.onCancel();
        }
      } else {
        this._toaster.errorToast(res.message);
        this.onCancel();
      }
    });
  }

  /**
   * getBankSyncStatus
   */
  public getBankSyncStatus(providerId) {
    let validateProvider;
    this._settingsLinkedAccountsService.GetBankSyncStatus(providerId).subscribe(res => {
      if (res.status === 'success' && res.body.providerAccount && res.body.providerAccount.length) {
        this.bankSyncInProgress = true;
        validateProvider = this.validateProviderResponse(res.body.providerAccount[0]);
        if (!validateProvider && !this.cancelRequest) {
            setTimeout(() => {
              this.getBankSyncStatus(providerId);
            }, 10000);
        }
      }
    });
  }

  /**
   * validateProviderResponse
   */
  public validateProviderResponse(provider) {
    let status = provider.status.toLowerCase();
      if (status === 'success' || status === 'failed') {
        this.bankSyncInProgress = false;
        return true;
      } else {
        return false;
      }
  }

  /**
   * resetBankForm
   */
  public resetBankForm() {
    this.step = 1;
    this.selectedProvider = {};
  }

}
