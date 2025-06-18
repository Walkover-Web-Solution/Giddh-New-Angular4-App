import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { GeneralActions } from '../../actions/general/general.actions';
import { ToasterService } from '../../services/toaster.service';
import { API_COUNT_LIMIT, PAGE_SIZE_OPTIONS } from '../../app.constant';
import { OcrVoucherStore } from '../utility/ocr-voucher.store';
@Component({
    selector: 'ocr-voucher-list',
    templateUrl: './ocr-voucher-list.component.html',
    styleUrls: ['./ocr-voucher-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [OcrVoucherStore]
})
export class OcrVoucherListComponent implements OnInit, OnDestroy {
    public dummyResponse =  {
        "items": [
            {
                "requestId": "eNUcBvMJhD9Rh7QgQaog",
                "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/b5e514d7-e498-48f2-b610-6653f517ddd8/pdf1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250617T091209Z&X-Amz-SignedHeaders=host&X-Amz-Expires=571670&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250617%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=73bfa97bbc090705016bcf28c907ce9470da782dc8bd85d89cf646e0b4011545",
                "type": "DOCUMENT_IMPORT",
                "status": "FAILED",
                "metaData": {
                    "total": 1,
                    "success": 0,
                    "failed": 1
                },
                "user": {
                    "name": "Dilpreet Singh Dang",
                    "uniqueName": "dilpreet@walkover.in",
                    "id": 2024,
                    "email": "dilpreet@walkover.in"
                },
                "fileName": "pdf1.pdf",
                "date": "17-06-2025 09:12:09",
                "files": [
                    {
                        "requestId": "fnc3A5PfP13St2L5zgXx",
                        "fileName": "uploaded-1375017284082744723.pdf",
                        "status": "FAILED",
                        "error": "Expected a ',' or ']' at 3292 [character 5 line 108]",
                        "mimeType": "pdf",
                        "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/vouchers/uploaded-1375017284082744723.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250617T091209Z&X-Amz-SignedHeaders=host&X-Amz-Expires=571670&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250617%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=10ec16f53a9f8bd8fb7022bbfa38a54c23268e5afd1838773b4b2f1d0aa19af0"
                    }
                ]
            },
            {
                "requestId": "9EP8ZQJeckkWavZ6Rc3G",
                "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/72276a3d-6049-43b0-8d4c-22f2507be700/invoice-09.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T065051Z&X-Amz-SignedHeaders=host&X-Amz-Expires=580148&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250609%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=5238e6916cce93126e3412063023ce56509c3032aefb34c37e33401705c2809f",
                "type": "DOCUMENT_IMPORT",
                "status": "COMPLETED",
                "metaData": {
                    "total": 1,
                    "success": 1,
                    "failed": 0
                },
                "fileName": "dilpreet.pdf",
                "user": {
                    "name": "Dilpreet Singh Dang",
                    "uniqueName": "dilpreet@whozzat.com",
                    "id": 2007,
                    "email": "dilpreet@whozzat.com"
                },
                "date": "09-06-2025 06:50:51",
                "files": [
                    {
                        "requestId": "A9Ge0CoY1VTiId5XNR4v",
                        "fileName": "uploaded-10863603592563015578.pdf",
                        "status": "COMPLETED",
                        "error": null,
                        "mimeType": "pdf",
                        "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/vouchers/uploaded-10863603592563015578.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T065052Z&X-Amz-SignedHeaders=host&X-Amz-Expires=580147&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250609%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=37193df1760491d26fd1d81a7d4b5861165f6a09768c45ab35a7fd9aab6e8bfd"
                    }
                ]
            },
            {
                "requestId": "bQNxAPfeilNwrKaaS8Tu",
                "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/ab8ebe89-3c3b-42ba-b770-5c5c6281e780/pdf2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T063934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=580825&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250609%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=d0258e1c6bfcf5b2cb36f6734f2425ab0c2585918c50ab0ed3d2e9693094ee1b",
                "type": "DOCUMENT_IMPORT",
                "status": "COMPLETED",
                "fileName": "invoice.pdf",
                "metaData": {
                    "total": 1,
                    "success": 1,
                    "failed": 0
                },
                "user": {
                    "name": "Dilpreet Singh Dang",
                    "uniqueName": "dilpreet@whozzat.com",
                    "id": 2007,
                    "email": "dilpreet@whozzat.com"
                },
                "date": "09-06-2025 06:39:34",
                "files": [
                    {
                        "requestId": "zW6asb6Cah5JGPQnDrJU",
                        "fileName": "uploaded-18205697875314877464.pdf",
                        "status": "COMPLETED",
                        "error": null,
                        "mimeType": "pdf",
                        "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/vouchers/uploaded-18205697875314877464.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T063934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=580825&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250609%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=ec8590321269994ea83589ac44f3a65df7fcfb971498961e8de83bad34fcef88"
                    }
                ]
            },
            {
                "requestId": "0QY2qUlZI4Nvw8pNc3QF",
                "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/6b3a19c2-ea81-4baf-afa4-1f44de76fc15/pdf1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T063554Z&X-Amz-SignedHeaders=host&X-Amz-Expires=581045&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250609%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=1d2086628e85dc34693dbaf6b7b6a61dd62a5d5a093fa4602de6bc2b4e9b7af8",
                "type": "DOCUMENT_IMPORT",
                "status": "COMPLETED",
                "fileName": "purchase.pdf",
                "metaData": {
                    "total": 1,
                    "success": 1,
                    "failed": 0
                },
                "user": {
                    "name": "Dilpreet Singh Dang",
                    "uniqueName": "dilpreet@whozzat.com",
                    "id": 2007,
                    "email": "dilpreet@whozzat.com"
                },
                "date": "09-06-2025 06:35:54",
                "files": [
                    {
                        "requestId": "nl2epVBHEqU2ipmPVWQA",
                        "fileName": "uploaded-1081069462256784198.pdf",
                        "status": "COMPLETED",
                        "error": null,
                        "mimeType": "pdf",
                        "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/vouchers/uploaded-1081069462256784198.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250609T063554Z&X-Amz-SignedHeaders=host&X-Amz-Expires=581045&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250609%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=a32bdfbff14200ae495fc64d81099c930b41fcb4447db0be45f092b493a7c192"
                    }
                ]
            },
            {
                "requestId": "mXUbCRl0iWE2kz8PrWyh",
                "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/22da4ef4-b0f8-4970-8c47-2c1442c851c1/pdf1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250607T103919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=566440&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250607%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=ad1e9af2213b3caec70824edc358ad210b4c15609f90f7924835356502691ece",
                "type": "DOCUMENT_IMPORT",
                "status": "IN_PROGRESS",
                "fileName": "1.pdf",
                "metaData": {
                    "total": 1,
                    "success": 0,
                    "failed": 0
                },
                "user": {
                    "name": "Dilpreet Singh Dang",
                    "uniqueName": "dilpreet@whozzat.com",
                    "id": 2007,
                    "email": "dilpreet@whozzat.com"
                },
                "date": "07-06-2025 10:39:19",
                "files": [
                    {
                        "requestId": "0HN88qpwkuRHTXKAt485",
                        "fileName": "uploaded-4846597344095318202.pdf",
                        "status": "SUBMITTED",
                        "error": null,
                        "mimeType": "pdf",
                        "path": "https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/vouchers/uploaded-4846597344095318202.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250607T103919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=566440&X-Amz-Credential=AKIAT5PXQ23PX5W2KKS3%2F20250607%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=5b776434f456d87279ea131db8f05350b43fdd885672e8a1ab4a062a0743d22b"
                    }
                ]
            }
        ],
        "page": 1,
        "count": 20,
        "totalPages": 1,
        "totalItems": 10
    };
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ['date','fileName', 'uploadedBy', 'status'];
    /** Hold the data of subscriptions */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store Subscription list observable*/
    public ocrList$: Observable<any> = this.componentStore.select(state => state.ocrList);
    /** Holds Store Subscription list in progress API success state as observable*/
    public ocrListInProgress$: Observable<any> = this.componentStore.select(state => state.ocrListInProgress);
    /** This will use for subscription pagination logs object */
    public ocrDocumentsRequestParams: any = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: API_COUNT_LIMIT,
    }
    /** Hold table page index number */
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /* Hold list searching value */
    public inlineSearch: any = '';
    /** Form Group for subscription form */
    public ocrDocumentListForm: FormGroup;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /* True if status show */
    public showStatus = false;
    /* True if user show */
    public showUploadedBy = false;
    /* True if file name show */
    public showFileName = false;
    /* True if show header */
    public showData: boolean = true;
    /** Getter for show search element by type */
    public get shouldShowElement(): boolean {
        const shouldShow = (
            this.ocrDocumentListForm?.controls['uploadedBy']?.value ||
            this.ocrDocumentListForm?.controls['status']?.value ||
            this.ocrDocumentListForm?.controls['fileName']?.value
        );
        this.showData = shouldShow;
        return shouldShow;
    }
    /** This will use for active company */
    public activeCompany: any = {};

    constructor(public dialog: MatDialog,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private componentStore: OcrVoucherStore,
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private generalActions: GeneralActions,
        private router: Router,
        private toasterService: ToasterService
    ) {
    }

    /**
     * Initializes the component by subscribing to route parameters and fetching ocr data.
     *
     * @memberof OcrVoucherListComponent
     */
    public ngOnInit(): void {
        this.initForm();
        this.getAllOcrDocuments(false);
        /** Get Ocr List */
        this.ocrList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {

            if (this.dummyResponse?.items) {
                this.dataSource = new MatTableDataSource<any>(this.dummyResponse?.items);
                if (this.dataSource?.filteredData?.length ||
                    this.ocrDocumentListForm?.controls['uploadedBy']?.value ||
                    this.ocrDocumentListForm?.controls['fileName']?.value ||
                    this.ocrDocumentListForm?.controls['status']?.value) {
                    this.showData = true;
                } else {
                    this.showData = false;
                }
                this.dataSource.paginator = this.paginator;
                this.ocrDocumentsRequestParams.totalItems = this.dummyResponse?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.showData = false;
                this.ocrDocumentsRequestParams.totalItems = 0;
            }
        });

        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                this.activeCompany = response;
            }
        });

        this.ocrDocumentListForm?.controls['status'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllOcrDocuments(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showStatus = false;
            }
        });
        
        this.ocrDocumentListForm?.controls['uploadedBy'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllOcrDocuments(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showUploadedBy = false;
            }
        });

        this.ocrDocumentListForm?.controls['fileName'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (this.isNotNullOrUndefined(searchedText)) {
                this.showClearFilter = true;
                this.getAllOcrDocuments(true);
            }
            if (this.isNullOrEmpty(searchedText)) {
                this.showClearFilter = false;
                this.showFileName = false;
            }
        });
    }

    /**
     * This will be use for check null or undefined values
     *
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof SubscriptionListComponent
     */
    public isNotNullOrUndefined(value: any): boolean {
        return value !== null && value !== undefined;
    }

    /**
     * This will be use for check null or space values
     *
     * @param {*} value
     * @return {*}  {boolean}
     * @memberof SubscriptionListComponent
     */
    public isNullOrEmpty(value: any): boolean {
        return value === null || value === "";
    }

    /**
     * This will use for init subscription form
     *
     * @memberof SubscriptionComponent
     */
    public initForm(): void {
        this.ocrDocumentListForm = this.formBuilder.group({
            status: null,
            uploadedBy: null,
            fileName: null
        });
    }

    /**
   * Returns the search field text
   *
   * @param {*} title
   * @returns {string}
   * @memberof SubscriptionComponent
   */
    public getSearchFieldText(title: any): string {
        return this.localeData?.search_field?.replace("[FIELD]", title);
    }

    /**
     * Handles clicks outside the specified element for filtering in the SubscriptionComponent.
     *
     * @param event - The event triggered by the click.
     * @param element - The element outside of which the click occurred.
     * @param searchedFieldName - The name of the field being searched for.
     * @memberof SubscriptionComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === 'Status') {
            if (this.ocrDocumentListForm?.controls['status'].value !== null && this.ocrDocumentListForm?.controls['status'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'Uploaded By') {
            if (this.ocrDocumentListForm?.controls['uploadedBy'].value !== null && this.ocrDocumentListForm?.controls['uploadedBy'].value !== '') {
                return;
            }
        } else if (searchedFieldName === 'File Name') {
            if (this.ocrDocumentListForm?.controls['fileName'].value !== null && this.ocrDocumentListForm?.controls['fileName'].value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === 'Status') {
                this.showStatus = false;
            } else if (searchedFieldName === 'Uploaded By') {
                this.showUploadedBy = false;
            } else if (searchedFieldName === 'File Name') {
                this.showFileName = false;
            }
        }
    }

    /**
     * This will be use for toggle search field
     *
     * @param {string} fieldName
     * @param {*} el
     * @memberof SubscriptionComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === 'Status') {
            this.showStatus = true;
        } else if (fieldName === 'Uploaded By') {
            this.showUploadedBy = true;
        } else if (fieldName === 'File Name') {
            this.showFileName = true;
        }
    }

    /**
     * Handle page change
     *
     * @param {*} event
     * @memberof SubscriptionComponent
     */
    public handlePageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.ocrDocumentsRequestParams.count = event.pageSize;
        this.ocrDocumentsRequestParams.page = event.pageIndex + 1;
        this.getAllOcrDocuments(false);
    }


    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SubscriptionComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.changeDetection.detectChanges();
        }
    }

    /**
     * Clears the filters and resets the form in the SubscriptionComponent.
     *
     * @memberof SubscriptionComponent
     */
    public clearFilter(): void {
        this.showClearFilter = false;
        this.showStatus = false;
        this.showUploadedBy = false;
        this.showFileName = false;
        this.ocrDocumentListForm.reset();
        this.inlineSearch = '';
        this.getAllOcrDocuments(false);
        this.changeDetection.detectChanges();
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
        let request = {
            pagination: this.ocrDocumentsRequestParams,
            model: this.ocrDocumentListForm.value
        };
        this.componentStore.getAllOcrList(request);
    }

    /**
     *  Handle Mat table sort event
     *
     * @param {*} event
     * @memberof OcrVoucherListComponent
     */
    public sortChange(event: any): void {
        this.ocrDocumentsRequestParams.sort = event?.direction ? event?.direction : 'asc';
        this.ocrDocumentsRequestParams.sortBy = event?.active;
        this.ocrDocumentsRequestParams.page = 1;
        this.getAllOcrDocuments(false);
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Removes "subscription-page" class from body, and completes the subject indicating component destruction.
     *
     * @memberof SubscriptionComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
