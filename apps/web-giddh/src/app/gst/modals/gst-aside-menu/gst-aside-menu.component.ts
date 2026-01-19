// tslint:disable:variable-name
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

/**
 * Handles Component functionality
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'gst-aside-menu',
    styleUrls: [`./gst-aside-menu.component.scss`],
    templateUrl: './gst-aside-menu.component.html',
    standalone: false
})
/**
 * GstAsideMenuComponent component
 * Handles gstasidemenu functionality and user interactions
 */
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
    public saveGspSessionInProcess = false;
    public otpSentSuccessFully = false;
    public authorizeGspSessionOtpInProcess = false;
    public gspSessionOtpAuthorized = false;
    public reconcileOtpInProcess$: Observable<boolean>;
    public reconcileOtpSuccess$: Observable<boolean>;
    public reconcileOtpVerifyInProcess$: Observable<boolean>;
    public reconcileOtpVerifySuccess$: Observable<boolean>;
    public pointsAccepted = false;
    public pointsAcceptedSubmitted = false;
    public submitGstForm: { isAccepted: boolean, txtVal: string } = { isAccepted: false, txtVal: '' };
    public defaultGstNumber: string = null;
    public companyGst$: Observable<string> = of('');
    public showCancelModal = false;
    public getCurrentPeriod: any = {};
    public gstAuthenticated = false;
    public gstReturnInProcess = false;
    public isTaxproAuthenticated = false;
    public isVayanaAuthenticated = false;
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private gstReconcileActions: GstReconcileActions,
        private toaster: ToasterService
    ) {
        this.reconcileOtpInProcess$ = this.store.pipe(select(p => p.gstReconcile.isGenerateOtpInProcess), takeUntil(this.destroyed$));
        this.reconcileOtpSuccess$ = this.store.pipe(select(p => p.gstReconcile.isGenerateOtpSuccess), takeUntil(this.destroyed$));
        this.reconcileOtpVerifyInProcess$ = this.store.pipe(select(p => p.gstReconcile.isGstReconcileVerifyOtpInProcess), takeUntil(this.destroyed$));
        this.reconcileOtpVerifySuccess$ = this.store.pipe(select(p => p.gstReconcile.isGstReconcileVerifyOtpSuccess), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(pro => {
            /**
             * Handles if functionality
             */
            if (pro && pro.addresses) {
                const gstNo = pro.addresses?.filter(f => {
                    return f.isDefault === true;
                }).map(p => {
                    return p.taxNumber;
                });
                /**
                 * Handles if functionality
                 */
                if (gstNo && gstNo[0]) {
                    this.defaultGstNumber = gstNo[0];
                    this.taxProForm.gstin = this.defaultGstNumber;
                    /**
                     * Sets timeout value
                     */
                    setTimeout(() => {
                        this.initialFormValue = cloneDeep(this.taxProForm);
                    }, 0);
                }
            }
        });

        this.store.pipe(select(p => p.gstR.saveGspSessionOtpSent), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.otpSentSuccessFully = yes;
        });

        this.store.pipe(select(p => p.gstR.saveGspSessionInProcess), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.saveGspSessionInProcess = yes;
        });

        this.store.pipe(select(p => p.gstR.authorizeGspSessionOtpInProcess), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.authorizeGspSessionOtpInProcess = yes;
        });

        this.store.pipe(select(p => p.gstR.gspSessionOtpAuthorized), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
            this.gspSessionOtpAuthorized = yes;
        });

        this.store.pipe(select(p => p.gstR.currentPeriod), takeUntil(this.destroyed$)).subscribe(data => {
            /**
             * Handles if functionality
             */
            if (data) {
                this.getCurrentPeriod = data;
            }
        });

        this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$)).subscribe((bool) => {
            /**
             * Handles if functionality
             */
            if (this.returnType === "gstr2" && !this.gstAuthenticated && bool) {
                this.closeAsidePane(null);
            }
            this.gstAuthenticated = bool;
        });

        this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$)).subscribe((val) => {
            /**
             * Handles if functionality
             */
            if (val) {
                this.fileGstComplete.emit(true);
                this.resetLocalFlags();
            }
        });

        this.store.pipe(select(p => p.gstR.gstReturnFileInProgress), takeUntil(this.destroyed$)).subscribe((value => this.gstReturnInProcess = value));

        this.store.pipe(select(s => s.gstR.gstSessionResponse), takeUntil(this.destroyed$)).subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.isTaxproAuthenticated = a.taxpro;
                this.isVayanaAuthenticated = a.vayana;
            }
        });
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.providerOptions = [{ label: this.localeData?.aside_menu?.giddh_provider1, value: 'TAXPRO' }];

        this.reconcileOtpVerifySuccess$.subscribe(s => {
            /**
             * Handles if functionality
             */
            if (s) {
                this.fireReconcileRequest.emit(true);
                this.closeAsidePane(null);
            }
        });

        this.companyGst$.subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.taxProForm.gstin = a;
                /**
                 * Sets timeout value
                 */
                setTimeout(() => {
                    this.initialFormValue = cloneDeep(this.taxProForm);
                }, 0);
            }
        });
    }

    /**
     * Closes asidepane
     */
    public closeAsidePane(event) {
        this.resetLocalFlags();
        this.closeAsideEvent.emit(event);
    }

    /**
     * Resets taxpro to default state
     */
    public resetTaxPro() {
        this.selectedService = this.taxServiceEnum.TAXPRO;
        this.taxProForm.otp = '';
        this.taxProForm.userName = '';
        this.otpSentSuccessFully = false;
    }

    /**
     * Resets localflags to default state
     */
    public resetLocalFlags() {
        this.resetTaxPro();
        this.pointsAccepted = false;
        this.pointsAcceptedSubmitted = false;
        this.submitGstForm = { isAccepted: false, txtVal: '' };
        this.store.dispatch(this.gstReconcileActions.ResetGstAsideFlags());
    }

    /**
     * save
     */
    public save() {
        this.taxProForm.gsp = this.selectedService;
        /**
         * Handles if functionality
         */
        if ((this.selectedService === this.taxServiceEnum.TAXPRO || this.selectedService === this.taxServiceEnum.VAYANA) && !this.otpSentSuccessFully) {
            this.store.dispatch(this.gstReconcileActions.SaveGSPSession(this.taxProForm));
        } else if ((this.selectedService === this.taxServiceEnum.TAXPRO || this.selectedService === this.taxServiceEnum.VAYANA) && this.otpSentSuccessFully) {
            /**
             * Handles if functionality
             */
            if (!(/^(?!\s*$).+/g.test(this.taxProForm.otp))) {
                this.toaster.showSnackBar('error',this.localeData?.aside_menu?.otp_required_error);
                return;
            }
            this.store.dispatch(this.gstReconcileActions.SaveGSPSessionWithOTP(this.taxProForm));
        }
    }

    /**
     * Handles generateReconcileOtp functionality
     */
    public generateReconcileOtp(form) {
        this.store.dispatch(
            this.gstReconcileActions.GstReconcileOtpRequest(form.uid)
        );
    }

    /**
     * Handles sendReconcileOtp functionality
     */
    public sendReconcileOtp(form) {
        const model: VerifyOtpRequest = new VerifyOtpRequest();
        model.otp = form.otp;
        this.store.dispatch(
            this.gstReconcileActions.GstReconcileVerifyOtpRequest(model)
        );
    }

    /**
     * Handles submitGstReturn functionality
     */
    public submitGstReturn() {
        this.submitGstForm.isAccepted = true;
        /**
         * Handles if functionality
         */
        if (this.submitGstForm.txtVal?.toLowerCase() !== 'SUBMIT'?.toLowerCase()) {
            this.toaster.showSnackBar('error',this.localeData?.aside_menu?.submit_gst_error);
            return;
        }
        this.fileGst.emit(true);
    }

    /**
     * Handles resendOtp functionality
     */
    public resendOtp() {
        this.otpSentSuccessFully = false;
        this.save();
    }

    /**
     * Handles changeProvider functionality
     */
    public changeProvider() {
        this.otpSentSuccessFully = false;
        this.taxProForm.otp = '';
    }

    /**
     * Toggle cancel model
     *
     * @memberof GstAsideMenuComponent
     */
    public toggleCancelModel(): void {
        /**
         * Handles if functionality
         */
        if (isEqual(this.taxProForm, this.initialFormValue)) {
            this.closeAsideEvent.emit(true);
        } else {
            this.cancelConfirmationEvent.emit(true);
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
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
