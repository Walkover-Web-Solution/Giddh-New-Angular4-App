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
    public selectedToggle: string = 'create';
    public upload: string = 'upload';
    public create: string = 'create';
    public list: string = 'list';
    public ocrUploadSuccess$: Observable<any> = this.ocrVoucherStore.ocrUploadSuccess$;
    public ocrImportSuccess$: Observable<any> = this.ocrVoucherStore.ocrImportSuccess$;
    public importVoucherSuccess$: Observable<any> = this.ledgerComponentStore.importVoucherSuccess$;
    public file: File;
    public listCount: number = 0;
    public ocrCompletedCount$: Observable<any> = this.ocrVoucherStore.ocrCompletedCount$;
    public ocrCompletedCountInProgress$: Observable<any> = this.ocrVoucherStore.ocrCompletedCountInProgress$;
    public countVariable: number = 0;
    public buttonDisabled: boolean = false;

    constructor(
        private ocrVoucherStore: OcrVoucherStore,
        private ledgerComponentStore: LedgerComponentStore,
        private ocrVoucherService: OcrVoucherService
    ) {

    }


    public ngOnInit() {

           // Call getCompletedCount every 5 seconds
    setInterval(() => {
        this.ocrVoucherStore.getCompletedCount(null);
    }, 5000);

        this.ocrVoucherService.listCount$.pipe(takeUntil(this.destroyed$)).subscribe((count: number) => {
            if (count) {
                this.listCount = count;
            }
        });

            // Update countVariable when the completed count is retrieved
    this.ocrCompletedCount$.pipe(takeUntil(this.destroyed$)).subscribe((count: any) => {
        if (count) {
            this.countVariable = count;
        }
    });


        // Disable or enable the button toggle based on the progress status
        this.ocrCompletedCountInProgress$.pipe(takeUntil(this.destroyed$)).subscribe((inProgress: boolean) => {
            this.buttonDisabled = inProgress;
        });

        this.ocrUploadSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            console.log('ocrUploadSuccess', res);
            if (res) {
                this.signedUrlResponse = res;
                this.ledgerComponentStore.uploadVoucher({ url: res.signedUrl, file: this.file });
            }
        });

        this.ledgerComponentStore.uploadVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(voucherResponse => {
            console.log('uploadVoucherSuccess', voucherResponse);
            if (voucherResponse) {
                this.ocrVoucherStore.importOcrDocument(this.signedUrlResponse);
            }
        });

        this.ocrImportSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            console.log('ocrImportSuccess', res);
            if (res) {
                this.ledgerComponentStore.importVoucher({ requestObject: res, signedUrlResponse: this.signedUrlResponse });
            }
        });

        this.importVoucherSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            console.log('importVoucherSuccess', res);
        });
    }

    public onToggleChange(event: MatButtonToggleChange) {
        const newValue = event.value;
        if (this.shouldPreventChange(newValue)) {
            return;
        } else {
            this.selectedToggle = newValue; // Accept the change
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
        console.log(event);
        // Open file dialog
        fileInput.click();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
