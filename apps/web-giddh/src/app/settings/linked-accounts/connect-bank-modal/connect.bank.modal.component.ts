import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of, ReplaySubject, Subject, merge } from 'rxjs';
import { SettingsLinkedAccountsService } from '../../../services/settings.linked.accounts.service';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store, select } from '@ngrx/store';
import { IForceClear } from '../../../models/api-models/Sales';

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

export class ConnectBankModalComponent implements OnChanges, OnInit, OnDestroy {

    @Input() public sourceOfIframe: string;
    @Output() public modalCloseEvent: EventEmitter<boolean> = new EventEmitter(false);
    @Output() public refreshAccountEvent: EventEmitter<any> = new EventEmitter(null);
    @Input() public providerId: string = '';
    @Input() public isRefreshWithCredentials: boolean = true;
    @Input() public providerAccountId: number = null;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public url: SafeResourceUrl = null;
    public iframeSrc: string = '';
    public isIframeLoading: boolean = false;
    public dataSource: any;
    public dataSourceBackup: any;
    /** Stores the search result for providers */
    public searchResults: Array<any> = [];
    /** Stores details of selected provider */
    public selectedProvider: any = {
        name: ''
    };
    public step: number = 1;
    public loginForm: UntypedFormGroup;
    public bankSyncInProgress: boolean;
    public apiInInterval: any;
    public cancelRequest: boolean = false;
    public needReloadingLinkedAccounts$: Observable<boolean> = of(false);
    public isElectron = isElectron;
    public base64StringForModel: SafeResourceUrl = '';
    /** Force clear for drop down */
    public forceClearReactive$: Observable<IForceClear> = of({ status: false });
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public click$ = new Subject<string>();

    constructor(public sanitizer: DomSanitizer,
        private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
        private _fb: UntypedFormBuilder,
        private _toaster: ToasterService,
        private store: Store<AppState>
    ) {
        this.needReloadingLinkedAccounts$ = this.store.pipe(select(s => s.settings.linkedAccounts.needReloadingLinkedAccounts), takeUntil(this.destroyed$));
        this.dataSource = (text$: Observable<any>): Observable<any> => {

            const inputClick$ = this.click$;

            return merge(text$, inputClick$).pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((term: string) => {
                    if (term.startsWith(' ', 0)) {
                        return [];
                    }

                    if (this.selectedProvider.name === undefined || this.selectedProvider.name === null) {
                        this.selectedProvider.name = "";
                    }

                    return this._settingsLinkedAccountsService.SearchBank(this.selectedProvider.name).pipe(catchError(e => {
                        return [];
                    }));
                }),
                map((res) => {
                    if (res?.status === 'success') {
                        let data = res?.body?.provider;
                        this.dataSourceBackup = res;
                        return data;
                    }
                }),
                takeUntil(this.destroyed$));
        };

        this.loginForm = this.initLoginForm();

        this.needReloadingLinkedAccounts$.subscribe(a => {
            if (a && this.isRefreshWithCredentials) {
                this.resetBankForm();
            }
        });
    }

    /**
     * Loads the default search results on launch
     *
     * @memberof ConnectBankModalComponent
     */
    public ngOnInit(): void {
        this.loadResults();
    }

    /**
     * Query change handler for providers
     *
     * @param {string} query Query searched by user
     * @memberof ConnectBankModalComponent
     */
    public onSearchQueryChanged(query: string): void {
        this.selectedProvider.name = query;
        this.loadResults();
    }

    /**
     * Loads the search results for searched provider
     *
     * @memberof ConnectBankModalComponent
     */
    public loadResults(): void {
        this._settingsLinkedAccountsService.SearchBank(this.selectedProvider.name).pipe(catchError(e => {
            this.searchResults = [];
            return [];
        }), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.searchResults = response?.body?.provider?.map(result => ({
                    ...result,
                    label: result.name,
                    value: result.id
                }));
                this.dataSourceBackup = response;
            }
        });
    }

    /**
     * initLoginForm
     */
    public initLoginForm() {
        return this._fb.group({
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
        if (changes.providerId && changes.providerId.currentValue) {
            this.step = 2;
            this.providerId = _.cloneDeep(changes.providerId.currentValue);
            this.getProviderLoginForm(this.providerId);
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
        this.bankSyncInProgress = false;
        this.isRefreshWithCredentials = true;
        this.forceClearReactive$ = of({ status: true });
    }

    /**
     * Handles the selection
     *
     * @param {*} event Stores the selected element details
     * @memberof ConnectBankModalComponent
     */
    public typeaheadOnSelect(event: any): void {
        this.selectedProvider = event;
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
        const inputRowControls = this.loginForm.controls['row'] as UntypedFormArray;
        const control = this.loginForm.controls['row'] as UntypedFormArray;

        // add addInputRow to the list
        if (item) {
            if (control.controls[i]) {
                control.controls[i]?.patchValue(item);
            } else {
                control.push(this.rowArray());
                setTimeout(() => {
                    control.controls[i]?.patchValue(item);
                }, 200);
            }
        } else {
            if (inputRowControls.controls[i].value.rate && inputRowControls.controls[i].value.stockUnitCode) {
                control.push(this.rowArray());
            }
        }
    }

    public onSelectProvider() {
        const inputRowControls = this.loginForm.controls['row'] as UntypedFormArray;
        if (inputRowControls?.controls?.length > 1) {
            inputRowControls.controls = inputRowControls.controls.splice(1);
        }
        this.getProviderLoginForm(this.selectedProvider.id);
    }

    /**
     * getProviderLoginForm
     */
    public getProviderLoginForm(providerId) {
        this.loginForm.reset();
        this._settingsLinkedAccountsService.GetLoginForm(providerId).pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a && a.status === 'success') {
                let response = _.cloneDeep(a.body.loginForm[0]);
                this.createLoginForm(response);
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
        this._settingsLinkedAccountsService.AddProvider(_.cloneDeep(objToSend), this.selectedProvider.id).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success') {
                this._toaster.successToast(res?.body);
                let providerId = res?.body?.replace(/[^0-9]+/ig, '');
                if (providerId) {
                    this.cancelRequest = false;
                    this.getBankSyncStatus(providerId);
                } else {
                    this.onCancel();
                }
            } else {
                this._toaster.errorToast(res?.message);
                this.onCancel();
            }
        });
    }

    /**
     * getBankSyncStatus
     */
    public getBankSyncStatus(providerId) {
        let validateProvider;
        this._settingsLinkedAccountsService.GetBankSyncStatus(providerId).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res?.status === 'success' && res?.body?.providerAccount && res?.body?.providerAccount?.length) {
                this.bankSyncInProgress = true;
                validateProvider = this.validateProviderResponse(res?.body?.providerAccount[0]);
                if (!validateProvider && !this.cancelRequest) {
                    setTimeout(() => {
                        this.getBankSyncStatus(providerId);
                    }, 2000);
                }
            }

        });
    }

    /**
     * validateProviderResponse
     */
    public validateProviderResponse(provider) {
        let status = provider?.status?.toLowerCase();
        if (status === 'success' || status === 'failed') {
            if (status === 'failed') {
                this._toaster.errorToast(this.localeData?.authentication_failed);
            }
            this.bankSyncInProgress = false;
            this.onCancel();
            return true;
        } else if (status === 'user_input_required' || status === 'addl_authentication_required') {
            let response = _.cloneDeep(provider.loginForm[0]);
            this.providerId = provider.id;
            if (response.formType === 'image') {
                this.bypassSecurityTrustResourceUrl(response.row[0].field[0].value);
            }
            response.row[0].field[0].value = '';
            this.createLoginForm(response);
            this.isRefreshWithCredentials = false;
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

    /**
     * refreshAccount
     */
    public refreshAccount(ev) {
        let objToSend = {
            loginForm: [],
            providerAccountId: this.providerId
        };
        objToSend.loginForm.push(this.loginForm.value);
        this.refreshAccountEvent.emit(objToSend);
        this.getBankSyncStatus(this.providerAccountId);
    }

    /**
     * createLoginForm
     */
    public createLoginForm(response) {
        this.loginForm = this.initLoginForm();
        this.loginForm?.patchValue({
            id: response.id,
            forgotPasswordUrL: response.forgotPasswordUrL,
            loginHelp: response.loginHelp,
            formType: response.formType,
        });
        response.row.map((item, i) => {
            this.addInputRow(i, item);
        });
    }

    /**
     * bypassSecurityTrustResourceUrl
     */
    public bypassSecurityTrustResourceUrl(val) {
        let str = 'data:application/pdf;base64,' + val;
        this.base64StringForModel = this.sanitizer.bypassSecurityTrustResourceUrl(str);
    }

    /**
     * Releases memory
     *
     * @memberof ConnectBankModalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
