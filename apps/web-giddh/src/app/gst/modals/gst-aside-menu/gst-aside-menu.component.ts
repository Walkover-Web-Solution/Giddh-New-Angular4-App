// tslint:disable:variable-name
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GstSaveGspSessionRequest, VerifyOtpRequest } from '../../../models/api-models/GstReconcile';
import { AppState } from '../../../store';
import { GstReconcileActions } from '../../../actions/gst-reconcile/gst-reconcile.actions';
import { ToasterService } from '../../../services/toaster.service';
import { GstReport, TaxServiceEnum, TaxServiceType } from '../../constants/gst.constant';
import { cloneDeep, isEqual } from '../../../lodash-optimized';
import { IOption } from '../../../app.constant';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'gst-aside-menu',
    styleUrls: [`./gst-aside-menu.component.scss`],
    templateUrl: './gst-aside-menu.component.html',
    standalone: false
})
export class GstAsideMenuComponent implements OnInit, OnDestroy {
    @Input() public selectedService: TaxServiceType;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public fireReconcileRequest: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public fileGst: EventEmitter<boolean> = new EventEmitter();
    @Output() public fileGstComplete: EventEmitter<boolean> = new EventEmitter();
    @Input() public activeCompanyGstNumber = '';
    @Input() public returnType: string;
    @Output() public cancelConfirmationEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public taxProForm: GstSaveGspSessionRequest = new GstSaveGspSessionRequest();
    public reconcileForm: any = {};
    /** Signal to track if GSP session save is in progress */
    public saveGspSessionInProcess = signal<boolean>(false);
    /** Signal to track if OTP was sent successfully */
    public otpSentSuccessFully = signal<boolean>(false);
    /** Signal to track if GSP session OTP authorization is in progress */
    public authorizeGspSessionOtpInProcess = signal<boolean>(false);
    /** Signal to track if GSP session OTP is authorized */
    public gspSessionOtpAuthorized = signal<boolean>(false);
    /** Signal to track if reconcile OTP generation is in process */
    public reconcileOtpInProcess: Signal<boolean>;
    /** Signal to track if reconcile OTP was generated successfully */
    public reconcileOtpSuccess: Signal<boolean>;
    /** Signal to track if reconcile OTP verification is in process */
    public reconcileOtpVerifyInProcess: Signal<boolean>;
    /** Signal to track if reconcile OTP verification was successful */
    public reconcileOtpVerifySuccess: Signal<boolean>;
    /** Signal to track if points are accepted */
    public pointsAccepted = signal<boolean>(false);
    /** Signal to track if points accepted form is submitted */
    public pointsAcceptedSubmitted = signal<boolean>(false);
    public submitGstForm: { isAccepted: boolean, txtVal: string } = { isAccepted: false, txtVal: '' };
    public defaultGstNumber: string = null;
    public companyGst$: Observable<string> = of('');
    /** Signal to track if cancel modal should be shown */
    public showCancelModal = signal<boolean>(false);
    public getCurrentPeriod: any = {};
    /** Signal to track if GST is authenticated */
    public gstAuthenticated = signal<boolean>(false);
    /** Signal to track if GST return filing is in process */
    public gstReturnInProcess = signal<boolean>(false);
    /** Signal to track if Taxpro service is authenticated */
    public isTaxproAuthenticated = signal<boolean>(false);
    /** Signal to track if Vayana service is authenticated */
    public isVayanaAuthenticated = signal<boolean>(false);
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public providerOptions: IOption[] = [];
    /** Holds Tax Service Enum */
    public taxServiceEnum: any = TaxServiceEnum;
    /** Holds initial form value to detect change at time of dialog close */
    public initialFormValue: any;

    constructor(
        private store: Store<AppState>,
        private gstReconcileActions: GstReconcileActions,
        private toaster: ToasterService
    ) {
        // Initialize reconcile signals
        this.reconcileOtpInProcess = toSignal(this.store.pipe(select(p => p.gstReconcile.isGenerateOtpInProcess), takeUntil(this.destroyed$)), { initialValue: false });
        this.reconcileOtpSuccess = toSignal(this.store.pipe(select(p => p.gstReconcile.isGenerateOtpSuccess), takeUntil(this.destroyed$)), { initialValue: false });
        this.reconcileOtpVerifyInProcess = toSignal(this.store.pipe(select(p => p.gstReconcile.isGstReconcileVerifyOtpInProcess), takeUntil(this.destroyed$)), { initialValue: false });
        this.reconcileOtpVerifySuccess = toSignal(this.store.pipe(select(p => p.gstReconcile.isGstReconcileVerifyOtpSuccess), takeUntil(this.destroyed$)), { initialValue: false });
        
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(pro => {
            if (pro && pro.addresses) {
                const gstNo = pro.addresses?.filter(f => {
                    return f.isDefault === true;
                }).map(p => {
                    return p.taxNumber;
                });
                if (gstNo && gstNo[0]) {
                    this.defaultGstNumber = gstNo[0];
                    this.taxProForm.gstin = this.defaultGstNumber;
                    setTimeout(() => {
                        this.initialFormValue = cloneDeep(this.taxProForm);
                    }, 0);
                }
            }
        });

        this.store.pipe(select(p => p.gstR.saveGspSessionOtpSent), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.otpSentSuccessFully.set(yes);
        });

        this.store.pipe(select(p => p.gstR.saveGspSessionInProcess), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.saveGspSessionInProcess.set(yes);
        });

        this.store.pipe(select(p => p.gstR.authorizeGspSessionOtpInProcess), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.authorizeGspSessionOtpInProcess.set(yes);
        });

        this.store.pipe(select(p => p.gstR.gspSessionOtpAuthorized), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.gspSessionOtpAuthorized.set(yes);
        });

        this.store.pipe(select(p => p.gstR.currentPeriod), takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.getCurrentPeriod = data;
            }
        });

        this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$)).subscribe((bool) => {
            if (this.returnType === "gstr2" && !this.gstAuthenticated() && bool) {
                this.closeAsidePane(null);
            }
            this.gstAuthenticated.set(bool);
        });

        this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$)).subscribe((val) => {
            if (val) {
                this.fileGstComplete.emit(true);
                this.resetLocalFlags();
            }
        });

        this.store.pipe(select(p => p.gstR.gstReturnFileInProgress), takeUntil(this.destroyed$)).subscribe((value => this.gstReturnInProcess.set(value)));

        this.store.pipe(select(s => s.gstR.gstSessionResponse), takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.isTaxproAuthenticated.set(a.taxpro);
                this.isVayanaAuthenticated.set(a.vayana);
            }
        });
    }

    public ngOnInit() {
        this.providerOptions = [{ label: this.localeData?.aside_menu?.giddh_provider1, value: 'TAXPRO' }];

        // Watch for reconcile OTP verification success
        this.store.pipe(
            select(p => p.gstReconcile.isGstReconcileVerifyOtpSuccess),
            takeUntil(this.destroyed$)
        ).subscribe(s => {
            if (s) {
                this.fireReconcileRequest.emit(true);
                this.closeAsidePane(null);
            }
        });

        this.companyGst$.subscribe(a => {
            if (a) {
                this.taxProForm.gstin = a;
                setTimeout(() => {
                    this.initialFormValue = cloneDeep(this.taxProForm);
                }, 0);
            }
        });
    }

    public closeAsidePane(event) {
        this.resetLocalFlags();
        this.closeAsideEvent.emit(event);
    }

    public resetTaxPro() {
        this.selectedService = this.taxServiceEnum.TAXPRO;
        this.taxProForm.otp = '';
        this.taxProForm.userName = '';
        this.otpSentSuccessFully.set(false);
    }

    public resetLocalFlags() {
        this.resetTaxPro();
        this.pointsAccepted.set(false);
        this.pointsAcceptedSubmitted.set(false);
        this.submitGstForm = { isAccepted: false, txtVal: '' };
        this.store.dispatch(this.gstReconcileActions.ResetGstAsideFlags());
    }

    /**
     * save
     */
    public save() {
        this.taxProForm.gsp = this.selectedService;
        if ((this.selectedService === this.taxServiceEnum.TAXPRO || this.selectedService === this.taxServiceEnum.VAYANA) && !this.otpSentSuccessFully()) {
            this.store.dispatch(this.gstReconcileActions.SaveGSPSession(this.taxProForm));
        } else if ((this.selectedService === this.taxServiceEnum.TAXPRO || this.selectedService === this.taxServiceEnum.VAYANA) && this.otpSentSuccessFully()) {
            if (!(/^(?!\s*$).+/g.test(this.taxProForm.otp))) {
                this.toaster.showSnackBar('error',this.localeData?.aside_menu?.otp_required_error);
                return;
            }
            this.store.dispatch(this.gstReconcileActions.SaveGSPSessionWithOTP(this.taxProForm));
        }
    }

    public generateReconcileOtp(form) {
        this.store.dispatch(
            this.gstReconcileActions.GstReconcileOtpRequest(form.uid)
        );
    }

    public sendReconcileOtp(form) {
        const model: VerifyOtpRequest = new VerifyOtpRequest();
        model.otp = form.otp;
        this.store.dispatch(
            this.gstReconcileActions.GstReconcileVerifyOtpRequest(model)
        );
    }

    public submitGstReturn() {
        this.submitGstForm.isAccepted = true;
        if (this.submitGstForm.txtVal?.toLowerCase() !== 'SUBMIT'?.toLowerCase()) {
            this.toaster.showSnackBar('error',this.localeData?.aside_menu?.submit_gst_error);
            return;
        }
        this.fileGst.emit(true);
    }

    public resendOtp() {
        this.otpSentSuccessFully.set(false);
        this.save();
    }

    public changeProvider() {
        this.otpSentSuccessFully.set(false);
        this.taxProForm.otp = '';
    }

    /**
     * Toggle cancel model
     *
     * @memberof GstAsideMenuComponent
     */
    public toggleCancelModel(): void {
        if (isEqual(this.taxProForm, this.initialFormValue)) {
            this.closeAsideEvent.emit(true);
        } else {
            this.cancelConfirmationEvent.emit(true);
        }
    }

    public ngOnDestroy() {
        this.resetLocalFlags();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will return gst authenticated text
     *
     * @returns {string}
     * @memberof GstAsideMenuComponent
     */
    public getGstAuthenticatedText(): string {
        let text = this.localeData?.aside_menu?.gst_authenticated;
        text = text?.replace("[IS_VAYANA_AUTHENTICATED]", (this.isVayanaAuthenticated ? this.commonLocaleData?.app_numbers?.one : this.commonLocaleData?.app_numbers?.one));
        return text;
    }
}
