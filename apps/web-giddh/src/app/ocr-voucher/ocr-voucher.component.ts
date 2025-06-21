import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Observable, ReplaySubject, take, takeUntil } from 'rxjs';
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
import { API_COUNT_LIMIT, API_POSTMAN_DOC_URL, BootstrapToggleSwitch } from '../app.constant';
import { cloneDeep } from '../lodash-optimized';
import { AuthenticationService } from '../services/authentication.service';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { NewConfirmationModalComponent } from '../theme/new-confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../services/general.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { OcrVoucherStore } from './utility/ocr-voucher.store';
import { LedgerComponentStore } from '../ledger/ledger.store';
import { OcrVoucherService } from '../services/ocr-voucher.service';
import { OcrVoucherListComponent } from './ocr-voucher-list/ocr-voucher-list.component';
import { OcrVoucherQueryParamsReq } from '../models/api-models/OcrVoucher';
dayjs.extend(duration)
@Component({
    selector: 'ocr-voucher',
    templateUrl: './ocr-voucher.component.html',
    styleUrls: ['./ocr-voucher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [OcrVoucherStore, LedgerComponentStore]
})
export class OcrVoucherComponent implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Store signed url response */
    public signedUrlResponse: any = {};
    /** This will use for subscription pagination logs object */
    public ocrDocumentsRequestParams: any = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: API_COUNT_LIMIT,
        from: "",
        to: "",
        sort: '',
        sortBy: ''
    }
    /** Holds Store Subscription list observable*/
    public ocrList$: Observable<any> = this.ocrVoucherStore.select(state => state.ocrList);
    /** Holds Store Subscription list in progress API success state as observable*/
    public ocrListInProgress$: Observable<any> = this.ocrVoucherStore.select(state => state.ocrListInProgress);
    public selectedToggle: string = '';
    public upload: string = 'upload';
    public create: string = 'create';
    public list: string = 'list';
    public ocrUploadSuccess$: Observable<any> = this.ocrVoucherStore.ocrUploadSuccess$;
    public ocrImportSuccess$: Observable<any> = this.ocrVoucherStore.ocrImportSuccess$;
    public importVoucherSuccess$: Observable<any> = this.ledgerComponentStore.importVoucherSuccess$;
    public file: File;
    public listCount: number = 0;
    public ocrCompletedCount$: Observable<number> = this.ocrVoucherStore.ocrCompletedCount$;
    public ocrCompletedCountInProgress$: Observable<boolean> = this.ocrVoucherStore.ocrCompletedCountInProgress$;
    public countVariable: number = 0;
    public buttonDisabled: boolean = true;
    public ocrExtractDocuments$: Observable<any> = this.ocrVoucherStore.ocrExtractDocuments$;
    public ocrExtractDocumentsInProgress$: Observable<boolean> = this.ocrVoucherStore.ocrExtractDocumentsInProgress$;
    public isLoading: boolean = false;
    public ocrList: any;
    public ocrMainList: any;
    public ocrMainListInProgress$: Observable<boolean> = this.ocrVoucherStore.ocrMainListInProgress$;
    public ocrMainList$: Observable<any> = this.ocrVoucherStore.ocrMainList$;
    public ocrUploadInProgress$: Observable<boolean> = this.ocrVoucherStore.ocrUploadInProgress$;
    public ocrCurrentToken: string = '';


    constructor(
        private ocrVoucherStore: OcrVoucherStore,
        private ledgerComponentStore: LedgerComponentStore,
        private ocrVoucherService: OcrVoucherService,
        private changeDetection: ChangeDetectorRef
    ) {
    }


    public ngOnInit() {
        this.getAllOcrDocuments(false);

        // Call getCompletedCount every 5 seconds
        setInterval(() => {
            this.ocrVoucherStore.getCompletedCount(null);
        }, 5000);

        this.ocrMainList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.listCount = res?.totalItems;
                this.ocrMainList = res;
                this.changeDetection.detectChanges();
            }
        });


        this.ocrMainListInProgress$.pipe(takeUntil(this.destroyed$)).subscribe((inProgress: boolean) => {
            this.isLoading = inProgress;
            this.ocrVoucherService.ocrList$.next(this.ocrList);
            this.selectedToggle = 'list';
            this.changeDetection.detectChanges();
        });

        // Update countVariable when the completed count is retrieved
        this.ocrCompletedCount$.pipe(takeUntil(this.destroyed$)).subscribe((count: number) => {
            if (count) {
                this.countVariable = count;
                this.buttonDisabled = this.countVariable === 0 ? true : false;
                this.changeDetection.detectChanges();
            }
        });

        // Disable or enable the button toggle based on the progress status
        this.ocrCompletedCountInProgress$.pipe(takeUntil(this.destroyed$)).subscribe((inProgress: boolean) => {
            this.buttonDisabled = inProgress;
            this.changeDetection.detectChanges();
        });



        this.ocrUploadSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.signedUrlResponse = res;
                this.ledgerComponentStore.uploadVoucher({ url: res.signedUrl, file: this.file });
            }
        });

        this.ledgerComponentStore.uploadVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(voucherResponse => {
            if (voucherResponse) {
                this.ocrVoucherStore.importOcrDocument(this.signedUrlResponse);
            }
        });

        this.ocrImportSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.getAllOcrDocuments(false);
                this.ocrVoucherService.uploadDataSuccess$.next(true);
            }
        });


        this.ocrExtractDocuments$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if(res){
                this.selectedToggle = 'create'; // Accept the change
                this.ocrVoucherService.getOcrData$.next(true);
                this.ocrVoucherService.ocrVoucherDetails$.next(res);
                this.ocrCurrentToken = res.token;
                this.changeDetection.detectChanges();
            } else {
                this.selectedToggle = 'list';
            }
        });

        this.ocrVoucherService.saveAndNextSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            if (response) {
                this.ocrVoucherStore.getExtractDocuments(response ?? '');
            }
        });
    }

/**
 * Retrieves all ocr documents in the SubscriptionComponent.
 *
 * @param resetPage - Indicates whether to reset the pagination page.
 * @memberof SubscriptionComponent
 */
    public getAllOcrDocuments(resetPage: boolean): void {
        if (resetPage) {
            this.ocrDocumentsRequestParams.page = 1;
        }

        let reqObj = {
            convertedStatus: null,
            fileName: null,
            status: null,
            uploadedBy: null
        };
        let request = {
            pagination: this.ocrDocumentsRequestParams,
            model: reqObj
        };
        this.ocrVoucherStore.getAllMainPageOcrData(request);
    }

    /**
     * Handles the toggle change event.
     *
     * @param event - The toggle change event.
     * @memberof SubscriptionComponent
     */
    public onChangeVoucher(value: string) {
        if (value === 'save') {
            this.ocrVoucherService.saveAndNext$.next(true);
        } else {
            this.ocrVoucherStore.getExtractDocuments({type: 'skip', token: this.ocrCurrentToken});
        }
    }

    public onToggleChange(value: any) {
        if (this.shouldPreventChange(value)) {
            return;
        } 
        if (value === 'create' && !this.buttonDisabled) {
            this.ocrVoucherStore.getExtractDocuments('');
        }
    }

    public shouldPreventChange(value: string): boolean {
        return value === 'upload';
    }

    public onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.file = file;
            this.ocrVoucherStore.uploadOcrDocument({ fileName: file.name });
        }
    }

    /**
     * Lifecycle method that is triggered once all the view child are rendered
     *
     * @memberof SubscriptionComponent
     */
    public ngAfterViewInit(): void {

    }

    public onUploadFile(event: any, fileInput: HTMLInputElement): void {
        // Open file dialog
        fileInput.click();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
