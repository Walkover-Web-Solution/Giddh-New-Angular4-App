// tslint:disable:variable-name
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GstSaveGspSessionRequest, VerifyOtpRequest } from '../../../models/api-models/GstReconcile';
import { AppState } from '../../../store';
import { GstReconcileActions } from '../../../actions/gst-reconcile/GstReconcile.actions';
import { ToasterService } from '../../../services/toaster.service';
import { GstReport } from '../../constants/gst.constant';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'gst-aside-menu',
    styleUrls: [`./gst-aside-menu.component.scss`],
    templateUrl: './gst-aside-menu.component.html'
})
export class GstAsideMenuComponent implements OnInit, OnDestroy {
    @Input() public selectedService: 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';
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
            if (pro && pro.addresses) {
                const gstNo = pro.addresses?.filter(f => {
                    return f.isDefault === true;
                }).map(p => {
                    return p.taxNumber;
                });
                if (gstNo && gstNo[0]) {
                    this.defaultGstNumber = gstNo[0];
                    this.taxProForm.gstin = this.defaultGstNumber;
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
            if (data) {
                this.getCurrentPeriod = data;
            }
        });

        this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$)).subscribe((bool) => {
            if (this.returnType === "gstr2" && !this.gstAuthenticated && bool) {
                this.closeAsidePane(null);
            }
            this.gstAuthenticated = bool;
        });

        this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$)).subscribe((val) => {
            if (val) {
                this.fileGstComplete.emit(true);
                this.resetLocalFlags();
            }
        });

        this.store.pipe(select(p => p.gstR.gstReturnFileInProgress), takeUntil(this.destroyed$)).subscribe((value => this.gstReturnInProcess = value));

        this.store.pipe(select(s => s.gstR.gstSessionResponse), takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.isTaxproAuthenticated = a.taxpro;
                this.isVayanaAuthenticated = a.vayana;
            }
        });
    }

    public ngOnInit() {
        this.providerOptions = [{label: this.localeData?.aside_menu?.giddh_provider1, value: 'TAXPRO'}];

        this.reconcileOtpVerifySuccess$.subscribe(s => {
            if (s) {
                this.fireReconcileRequest.emit(true);
                this.closeAsidePane(null);
            }
        });

        this.companyGst$.subscribe(a => {
            if (a) {
                this.taxProForm.gstin = a;
            }
        });
    }

    public closeAsidePane(event) {
        this.resetLocalFlags();
        this.closeAsideEvent.emit(event);
    }

    public resetTaxPro() {
        this.selectedService = 'TAXPRO';
        this.taxProForm.otp = '';
        this.taxProForm.userName = '';
        this.otpSentSuccessFully = false;
    }

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
        if ((this.selectedService === 'TAXPRO' || this.selectedService === 'VAYANA') && !this.otpSentSuccessFully) {
            this.store.dispatch(this.gstReconcileActions.SaveGSPSession(this.taxProForm));
        } else if ((this.selectedService === 'TAXPRO' || this.selectedService === 'VAYANA') && this.otpSentSuccessFully) {
            if (!(/^(?!\s*$).+/g.test(this.taxProForm.otp))) {
                this.toaster.errorToast(this.localeData?.aside_menu?.otp_required_error);
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
            this.toaster.errorToast(this.localeData?.aside_menu?.submit_gst_error);
            return;
        }
        this.fileGst.emit(true);
    }

    public resendOtp() {
        this.otpSentSuccessFully = false;
        this.save();
    }

    public changeProvider() {
        this.otpSentSuccessFully = false;
        this.taxProForm.otp = '';
    }

    public toggleCancelModel() {
        this.cancelConfirmationEvent.emit(true);
    }

    public ngOnDestroy() {
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
