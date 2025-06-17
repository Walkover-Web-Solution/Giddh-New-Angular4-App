import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../store';
import { select, Store } from '@ngrx/store';
import { GeneralActions } from '../actions/general/general.actions';
import { ToasterService } from '../services/toaster.service';
import { CompanyResponse } from '../models/api-models/Company';
import { SignupWithMobile, UserDetails, VerifyMobileModel } from '../models/api-models/loginModels';
import { GIDDH_DATE_FORMAT_DD_MM_YYYY, GIDDH_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ClipboardService } from 'ngx-clipboard';
import { LoginActions } from '../actions/login.action';
import { SessionActions } from '../actions/session.action';
import { API_POSTMAN_DOC_URL, BootstrapToggleSwitch } from '../app.constant';
import { cloneDeep } from '../lodash-optimized';
import { AuthenticationService } from '../services/authentication.service';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { NewConfirmationModalComponent } from '../theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../services/general.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
dayjs.extend(duration)
@Component({
    selector: 'ocr-voucher',
    templateUrl: './ocr-voucher.component.html',
    styleUrls: ['./ocr-voucher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OcrVoucherComponent implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    public selectedToggle: string = '';
    public upload: string = 'upload';
    public create: string = 'create';
    public list: string = 'list';


    constructor(private store: Store<AppState>,
        private toasty: ToasterService,
        private loginService: AuthenticationService,
        private loginAction: LoginActions,
        private router: Router,
        private sessionAction: SessionActions,
        private route: ActivatedRoute,
        private breakPointObservar: BreakpointObserver,
        private generalActions: GeneralActions,
        private changeDetectionRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private generalService: GeneralService,
        private clipboardService: ClipboardService
    ) {
    }


    public ngOnInit() {
        // document.querySelector('body').classList.add('setting-sidebar-open');


        // if (!this.isCreateAndSwitchCompanyInProcess) {
        //     document.querySelector('body').classList.add('tabs-page');
        // } else {
        //     document.querySelector('body').classList.remove('tabs-page');
        // }

        // this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
        //     if (params['type'] && this.tabName[this.activeTabIndex] !== params['type']) {
        //         this.activeTabIndex = this.tabName.indexOf(params['type']);
        //     } else if (!params['type'] && !this.activeTabIndex) {
        //         this.activeTabIndex = 0;
        //     }
        // });

        // this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
        //     if (params && params.tabIndex) {
        //         if (params && params.tabIndex == "0") {
        //             this.activeTabIndex = 0;
        //         } else if (params && params.tabIndex == "1") {
        //             this.activeTabIndex = 1;
        //         } else if (params && params.tabIndex == "2") {
        //             this.activeTabIndex = 2;
        //         } else if (params && params.tabIndex == "3") {
        //             this.activeTabIndex = 3;
        //         }
        //         this.router.navigate(['pages/user-details/', this.tabName[this.activeTabIndex]], { replaceUrl: true });
        //     }
        // });

        // this.contactNo$.subscribe(appState => this.phoneNumber = appState);
        // this.countryCode$.subscribe(appState => this.countryCode = appState);
        // this.isAddNewMobileNoSuccess$.subscribe(appState => this.showVerificationBox = appState);
        // this.isVerifyAddNewMobileNoSuccess$.subscribe(appState => {
        //     if (appState) {
        //         this.oneTimePassword = '';
        //         this.showVerificationBox = false;
        //     }
        // });
        // this.authenticateTwoWay$.subscribe(response => {
        //     this.twoWayAuth = (response) ? true : false;
        // });
        // this.store.dispatch(this.loginAction.FetchUserDetails());
        // this.loginService.GetAuthKey().pipe(takeUntil(this.destroyed$)).subscribe(a => {
        //     if (a?.status === 'success') {
        //         this.userAuthKey = a?.body?.authKey;
        //     } else {
        //         this.toasty.errorToast(a?.message, a?.status);
        //     }
        // });
        // this.store.pipe(select(appState => appState.subscriptions.companies), takeUntil(this.destroyed$))
        //     .subscribe(appState => this.companies = appState);
        // this.store.pipe(select(appState => appState.subscriptions.companyTransactions), takeUntil(this.destroyed$))
        //     .subscribe(appState => this.companyTransactions = appState);

        // this.store.pipe(select(appState => appState.session.user), takeUntil(this.destroyed$)).subscribe((user) => {
        //     if (user) {
        //         this.user = cloneDeep(user.user);
        //         this.userSessionId = _.cloneDeep(user.session?.id);
        //     }
        // });

        // this.store.pipe(select(profile => profile.settings.profile), takeUntil(this.destroyed$)).subscribe((response: any) => {
        //     if (response) {
        //         this.profileData = response;
        //     }
        //     this.changeDetectionRef.detectChanges();
        // });

        // this.store.dispatch(this.sessionAction.getAllSession());

        // this.userSessionResponse$.subscribe(appState => {
        //     if (appState && appState.length) {
        //         this.userSessionList = appState.map(session => {
        //             // Calculate sign in date
        //             session.signInDate = dayjs(session.createdAt).format(GIDDH_DATE_FORMAT_DD_MM_YYYY);
        //             // Calculate sign in time
        //             session.signInTime = dayjs(session.createdAt).format('LTS');
        //             // Calculate duration
        //             const duration = dayjs.duration(dayjs().diff(session.createdAt));
        //             session.sessionDuration = `${duration.days()}/${duration.hours()}/${duration.minutes()}/${duration.seconds()}`;
        //             return session;
        //         });
        //         this.changeDetectionRef.detectChanges();
        //     }
        // });

        // this.isUpdateCompanyInProgress$.pipe(takeUntil(this.destroyed$)).subscribe(inProcess => {
        //     this.isCreateAndSwitchCompanyInProcess = inProcess;
        //     this.changeDetectionRef.detectChanges();
        // });

    }

    public onToggleChange(event: MatButtonToggleChange) {
        console.log(event);
        this.selectedToggle = event.value;
    }

    /**
     * Lifecycle method that is triggered once all the view child are rendered
     *
     * @memberof SubscriptionComponent
     */
    public ngAfterViewInit(): void {

    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
