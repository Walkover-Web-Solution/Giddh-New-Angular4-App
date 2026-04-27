import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { debounceTime, delay, distinctUntilChanged, filter, Observable, ReplaySubject, startWith, Subject, switchMap, takeUntil } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { FormBuilder, FormGroup } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../app.constant";
import { MatSort, Sort } from "@angular/material/sort";
import { AiOcrStore } from "../utility/ai-ocr.store";
import { AiOcrService } from "../../services/ai-ocr.service";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { GeneralActions } from "../../actions/general/general.actions";
import { ActivatedRoute } from "@angular/router";
import { VoucherTypeEnum } from "../../models/api-models/Sales";
import { GoToBranchVariant } from "../../shared/go-to-branch/go-to-branch.component";

@Component({
    selector: "ai-ocr-list",
    templateUrl: "./ai-ocr-list.component.html",
    styleUrls: ["./ai-ocr-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AiOcrStore],
    standalone:false
})
export class AiOcrListComponent implements OnInit, OnDestroy {
    /** Expose GoToBranchVariant enum to template */
    protected readonly GoToBranchVariant = GoToBranchVariant;
    /** Holds table sorting reference */
    @ViewChild(MatSort) sortBy: MatSort;
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Subject to manage the route scope */
    private routeScope$: Subject<void> = new Subject<void>();
    /** Interval ID for completed count */
    private completedIntervalId: any;
    /** This will use for table heading */
    public displayedColumns: string[] = ["date", "fileName", "uploadedBy", "fileStatus", "convertedStatus", 'action'];
    /** Hold the data of ocr list */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store ocr list observable*/
    public ocrList$: Observable<any> = this.componentStore.select((state) => state.ocrList);
    /** Holds Store ocr list in progress API success state as observable*/
    public ocrListInProgress$: Observable<any> = this.componentStore.select((state) => state.ocrListInProgress);
    /** This will use for ocr pagination logs object */
    public ocrDocumentsRequestParams: any = {
        page: 1,
        totalPages: 0,
        totalItems: 0,
        count: PAGINATION_LIMIT,
        from: "",
        to: "",
        sort: "desc",
        sortBy: "DATE",
        branchUniqueName: ""
    };
    /** Hold table page index number */
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /* Hold list searching value */
    public inlineSearch: any = "";
    /** Form Group for ocr document list form */
    public ocrDocumentListForm: FormGroup;
    /* True if status show */
    public showStatus = false;
    /* True if converted status show */
    public showconvertedStatus = false;
    /* True if user show */
    public showUploadedBy = false;
    /* True if file name show */
    public showFileName = false;
    /* True if show header */
    public showData: boolean = true;
    /** This will use for active company */
    public activeCompany: any = {};
    /** True if is company */
    @Input() public isCompany: boolean = true;
    /** Hold broadcast event */
    public broadcast: any;
    /** True if show clear filter */
    public showClearFilter: boolean = false;
    /** This will use for ocr type */
    public ocrType: string = "";
    /** This will use for transaction type */
    public transactionOptions: Array<{ label: string; value: string }> = [];

    constructor(
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private componentStore: AiOcrStore,
        private aiOcrService: AiOcrService,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private generalActions: GeneralActions,
        private route: ActivatedRoute
    ) {
    }

    /**
     * Initializes the component by subscribing to route parameters and fetching ocr data.
     *
     * @memberof AiOcrListComponent
     */
    public ngOnInit(): void {
        this.initForm();
        this.route.params.pipe(delay(100), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                // End previous route scope and clear any existing interval before starting new scope
                this.routeScope$.next();
                this.routeScope$.complete();
                this.routeScope$ = new Subject<void>();
                if (this.completedIntervalId) {
                    clearInterval(this.completedIntervalId);
                    this.completedIntervalId = null;
                }
                this.ocrType = response.type;
                this.transactionOptions = this.ocrType === 'income'
                    ? [
                        { label: this.commonLocaleData?.app_create_invoice, value: VoucherTypeEnum.sales },
                        { label: this.commonLocaleData?.app_create_credit_note, value: VoucherTypeEnum.creditNote },
                        { label: this.commonLocaleData?.app_create_receipt, value: VoucherTypeEnum.receipt }
                    ]
                    : [
                        { label: this.commonLocaleData?.app_create_bill, value: VoucherTypeEnum.purchase },
                        { label: this.commonLocaleData?.app_create_debit_note, value: VoucherTypeEnum.debitNote },
                        { label: this.commonLocaleData?.app_create_payment, value: VoucherTypeEnum.payment }
                    ];
                /** Subscribe to main page OCR data only */
                this.aiOcrService.mainPageOcrData$.pipe(
                    takeUntil(this.destroyed$),
                    takeUntil(this.routeScope$),
                ).subscribe((data) => {
                    this.updateDataSource(data);
                });


                this.aiOcrService.uploadDataSuccess$.pipe(takeUntil(this.destroyed$), takeUntil(this.routeScope$)).subscribe((res) => {
                    if (res) {
                        this.aiOcrService.mainPageOcrData$.next(null);
                        this.getAllOcrDocuments(false);
                        this.ocrDataUpdate();
                    }
                });

                this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$), takeUntil(this.routeScope$)).subscribe((response) => {
                    if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                        this.activeCompany = response;
                    }
                });


                this.ocrDocumentListForm?.controls["status"].valueChanges
                    .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$), takeUntil(this.routeScope$))
                    .subscribe((searchedText) => {
                        if (this.isNotNullOrUndefined(searchedText) && searchedText.trim() !== "") {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            // Switch to list mode when filtering
                            this.aiOcrService.mainPage$.next(false);
                        }
                        if (this.isNullOrEmpty(searchedText)) {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            this.showStatus = false;
                        }
                        this.getAllOcrDocuments(false);
                        this.ocrDataUpdate();
                    });

                this.ocrDocumentListForm?.controls["convertedStatus"].valueChanges
                    .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$), takeUntil(this.routeScope$))
                    .subscribe((searchedText) => {
                        if (this.isNotNullOrUndefined(searchedText) && searchedText.trim() !== "") {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            // Switch to list mode when filtering
                            this.aiOcrService.mainPage$.next(false);
                        }
                        if (this.isNullOrEmpty(searchedText)) {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            this.showconvertedStatus = false;
                        }
                        this.getAllOcrDocuments(false);
                        this.ocrDataUpdate();
                    });

                this.ocrDocumentListForm?.controls["uploadedBy"].valueChanges
                    .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$), takeUntil(this.routeScope$))
                    .subscribe((searchedText) => {
                        if (this.isNotNullOrUndefined(searchedText) && searchedText.trim() !== "") {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);

                            this.aiOcrService.mainPage$.next(false);
                        }
                        if (this.isNullOrEmpty(searchedText)) {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            this.showUploadedBy = false;
                        }
                        this.getAllOcrDocuments(false);
                        this.ocrDataUpdate();
                    });

                this.ocrDocumentListForm?.controls["fileName"].valueChanges
                    .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$), takeUntil(this.routeScope$))
                    .subscribe((searchedText) => {
                        if (this.isNotNullOrUndefined(searchedText) && searchedText.trim() !== "") {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);

                            this.aiOcrService.mainPage$.next(false);
                        }
                        if (this.isNullOrEmpty(searchedText)) {
                            this.aiOcrService.sendListData$.next(this.ocrDocumentListForm.value);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            this.showFileName = false;
                        }
                        this.getAllOcrDocuments(false);
                        this.ocrDataUpdate();
                    });

                this.aiOcrService.mainPage$.pipe(takeUntil(this.destroyed$), takeUntil(this.routeScope$)).subscribe((response) => {
                    if (!response) {
                        this.aiOcrService.dateRangeEmit$.pipe(takeUntil(this.destroyed$), takeUntil(this.routeScope$)).subscribe((res) => {
                            if (res) {
                               this.ocrDocumentsRequestParams.from = res.from;
                                this.ocrDocumentsRequestParams.to = res.to;
                            }
                        });
                    }
                });

                this.aiOcrService.resetData$.pipe(takeUntil(this.routeScope$), takeUntil(this.routeScope$)).subscribe((res) => {
                    if (res) {
                        this.resetFilter(res);
                    }
                });

                this.aiOcrService.selectBranch$.pipe(takeUntil(this.destroyed$), takeUntil(this.routeScope$)).subscribe((res) => {
                    if (res) {
                        this.ocrDocumentsRequestParams.branchUniqueName = res.branchUniqueName;
                        this.ocrDocumentsRequestParams.from = res.from;
                        this.ocrDocumentsRequestParams.to = res.to;
                        this.getAllOcrDocuments(false);
                        this.ocrDataUpdate();
                    }
                });
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     * Getter for show search element by type
     *
     * @readonly
     * @type {boolean}
     * @memberof AiOcrListComponent
     */
    public get shouldShowElement(): boolean {
        const shouldShow =
            this.ocrDocumentListForm?.controls["uploadedBy"]?.value ||
            this.ocrDocumentListForm?.controls["status"]?.value ||
            this.ocrDocumentListForm?.controls["fileName"]?.value ||
            this.ocrDocumentListForm?.controls["convertedStatus"]?.value;
        this.showData = shouldShow;
        return shouldShow;
    }


    /**
     * This will be used to check null or undefined values.
     *
     * @param {*} value
     * @return {*} {boolean}
     * @memberof AiOcrListComponent
     */
    public isNotNullOrUndefined(value: any): boolean {
        return value !== null && value !== undefined;
    }

    /**
     * This will be used to check null or space values.
     *
     * @param {*} value
     * @return {*} {boolean}
     * @memberof AiOcrListComponent
     */
    public isNullOrEmpty(value: any): boolean {
        return value === null || value === "";
    }

    /**
     * This will use for initializing the ocr document list form.
     *
     * @memberof AiOcrListComponent
     */
    public initForm(): void {
        this.ocrDocumentListForm = this.formBuilder.group({
            status: null,
            uploadedBy: null,
            fileName: null,
            convertedStatus: null,
        });
    }

    /**
     * Returns the search field text.
     *
     * @param {*} title
     * @returns {string}
     * @memberof AiOcrListComponent
     */
    public getSearchFieldText(title: any): string {
        return this.localeData?.search_field?.replace("[FIELD]", title);
    }

    /**
     * This will use for go to branch mode
     *
     * @memberof ProjectWiseAccountingListComponent
     */
    public gotToBranchTab(): void {
        this.broadcast = new BroadcastChannel("ai-ocr");
        this.broadcast.postMessage({ success: true });
    }

    /**
     * Handles clicks outside the specified element for filtering in the AiOcrListComponent.
     *
     * @param event - The event triggered by the click.
     * @param element - The element outside of which the click occurred.
     * @param searchedFieldName - The name of the field being searched for.
     * @memberof AiOcrListComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "File Status") {
            if (
                this.ocrDocumentListForm?.controls["status"].value !== null &&
                this.ocrDocumentListForm?.controls["status"].value !== ""
            ) {
                return;
            }
        } else if (searchedFieldName === "Uploaded By") {
            if (
                this.ocrDocumentListForm?.controls["uploadedBy"].value !== null &&
                this.ocrDocumentListForm?.controls["uploadedBy"].value !== ""
            ) {
                return;
            }
        } else if (searchedFieldName === "File Name") {
            if (
                this.ocrDocumentListForm?.controls["fileName"].value !== null &&
                this.ocrDocumentListForm?.controls["fileName"].value !== ""
            ) {
                return;
            }
        } else if (searchedFieldName === "Converted Status") {
            if (
                this.ocrDocumentListForm?.controls["convertedStatus"].value !== null &&
                this.ocrDocumentListForm?.controls["convertedStatus"].value !== ""
            ) {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === "File Status") {
                this.showStatus = false;
            } else if (searchedFieldName === "Uploaded By") {
                this.showUploadedBy = false;
            } else if (searchedFieldName === "File Name") {
                this.showFileName = false;
            } else if (searchedFieldName === "Converted Status") {
                this.showconvertedStatus = false;
            }
        }
    }

    /**
     * This will be used to toggle search field.
     *
     * @param {string} fieldName
     * @memberof AiOcrListComponent
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "File Status") {
            this.showStatus = true;
        } else if (fieldName === "Uploaded By") {
            this.showUploadedBy = true;
        } else if (fieldName === "File Name") {
            this.showFileName = true;
        } else if (fieldName === "Converted Status") {
            this.showconvertedStatus = true;
        }
    }

    /**
     * Handle page change.
     *
     * @param {*} event
     * @memberof AiOcrListComponent
     */
    public handlePageChange(event: PageEvent): void {
        if (this.ocrDocumentsRequestParams.count !== event.pageSize) {
            this.ocrDocumentsRequestParams.page = 1;
            this.pageIndex = 0;
        } else {
            this.ocrDocumentsRequestParams.page = event.pageIndex + 1;
            this.pageIndex = event.pageIndex;
        }
        this.ocrDocumentsRequestParams.count = event.pageSize;
        this.getAllOcrDocuments(false);
        this.ocrDataUpdate();
    }

    /**
     * Clears the filters and resets the form in the AiOcrListComponent.
     *
     * @memberof AiOcrListComponent
     */
    public resetFilter(res: any): void {
        this.showStatus = false;
        this.showUploadedBy = false;
        this.showFileName = false;
        this.showClearFilter = false;
        this.ocrDocumentListForm.patchValue({
            status: null,
            fileName: null,
            uploadedBy: null,
            convertedStatus: null,
        });
        this.inlineSearch = "";
        this.ocrDocumentsRequestParams.from = res.from;
        this.ocrDocumentsRequestParams.to = res.to;
        this.getAllOcrDocuments(true);
        this.ocrDataUpdate();
    }

    /**
     * Updates the data source with the provided data.
     *
     * @param data - The data to update the data source with.
     * @memberof AiOcrListComponent
     */
    private updateDataSource(data: any): void {
        if (data?.items) {
            this.dataSource = new MatTableDataSource<any>(data.items);
            if (
                this.dataSource?.filteredData?.length ||
                this.ocrDocumentListForm?.controls["uploadedBy"]?.value ||
                this.ocrDocumentListForm?.controls["fileName"]?.value ||
                this.ocrDocumentListForm?.controls["status"]?.value ||
                this.ocrDocumentListForm?.controls["convertedStatus"]?.value
            ) {
                this.showData = true;
            } else {
                this.showData = false;
            }
            this.dataSource.paginator = this.paginator;
            this.ocrDocumentsRequestParams.totalItems = data.totalItems;
        } else {
            this.dataSource = new MatTableDataSource<any>([]);
            this.showData = false;
            this.ocrDocumentsRequestParams.totalItems = 0;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Retrieves all OCR documents in the AiOcrListComponent.
     *
     * @param resetPage - Indicates whether to reset the pagination page.
     * @memberof AiOcrListComponent
     */
    public getAllOcrDocuments(resetPage: boolean): void {
        if (resetPage) {
            this.ocrDocumentsRequestParams.page = 1;
        }
        let request = {
            pagination: this.ocrDocumentsRequestParams,
            model: this.ocrDocumentListForm.value,
            ocrType: this.ocrType,
        };
        this.componentStore.getAllOcrList(request);
        this.changeDetection.detectChanges();
    }

    /**
     * Handle Mat table sort event.
     *
     * @param {*} event
     * @memberof AiOcrListComponent
     */
    public sortChange(event: Sort): void {
        if (event) {
            this.ocrDocumentsRequestParams.sort = event.direction ? event.direction : "asc";
            this.ocrDocumentsRequestParams.sortBy = event.active?.toUpperCase();
            this.ocrDocumentsRequestParams.page = 1;
            this.getAllOcrDocuments(false);
            this.ocrDataUpdate();
        }
    }

    /**
     * Callback for date/range selection in datepicker.
     *
     * @param {*} [value]
     * @param {*} [from]
     * @return {*} {void}
     * @memberof AiOcrListComponent
     */
    public dateSelectedCallback(event: any): void {
        this.showClearFilter = true;
        this.ocrDocumentsRequestParams.from = event.from;
        this.ocrDocumentsRequestParams.to = event.to;
        this.getAllOcrDocuments(true);
        this.ocrDataUpdate();
    }

    /**
     * This will be used to update the data source.
     *
     * @memberof AiOcrListComponent
     */
    public ocrDataUpdate(): void {
        setTimeout(() => {
            this.ocrList$.pipe(
                takeUntil(this.routeScope$),
            ).subscribe((data) => {
                this.store.dispatch(this.generalActions.openSideMenu(true));
                this.updateDataSource(data);
            });
        }, 100);
        this.changeDetection.detectChanges();
    }

    /**
     * This will be used to reset the date range.
     *
     * @memberof AiOcrListComponent
     */
    public resetDateRange(): void {
        this.ocrDocumentsRequestParams.from = "";
        this.ocrDocumentsRequestParams.to = "";
        this.getAllOcrDocuments(true);
        this.ocrDataUpdate();
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Completes the subject indicating component destruction.
     *
     * @memberof AiOcrListComponent
     */
    public ngOnDestroy(): void {
        if (this.completedIntervalId) {
            clearInterval(this.completedIntervalId);
            this.completedIntervalId = null;
        }
        this.routeScope$.next();
        this.routeScope$.complete();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will be used to check null or undefined values.
     *
     * @param {*} voucherTypeObj
     * @param {*} element
     * @return {*} {boolean}
     * @memberof AiOcrListComponent
     */
    public selectVoucher(voucherTypeObj: any, element: any): void {
        const req = {
            row: element,
            type: voucherTypeObj.value,
            ocrType: this.ocrType
        }
        this.aiOcrService.ocrListToCreate$.next(req);
    }
}
