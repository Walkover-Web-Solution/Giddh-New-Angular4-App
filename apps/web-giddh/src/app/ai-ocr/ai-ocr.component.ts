import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { delay, Observable, ReplaySubject, takeUntil, Subject, take } from "rxjs";
import { MatMenuTrigger } from "@angular/material/menu";
import { Configuration, GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../app.constant";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import { AiOcrStore } from "./utility/ai-ocr.store";
import { LedgerComponentStore } from "../ledger/ledger.store";
import { AiOcrService } from "../services/ai-ocr.service";
import { GeneralService } from "../services/general.service";
import { OrganizationType } from "../models/user-login-state";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../shared/helpers/defaultDateFormat";
import { cloneDeep } from "../lodash-optimized";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from '../../environments/environment.generated';
import { ServiceConfig } from "../services/service.config";
dayjs.extend(duration);

export enum OcrAction {
    Skip = "skip",
    Create = "create",
    List = "list",
    Save = "save",
    Upload = "upload",
}
@Component({
    selector: "ai-ocr",
    templateUrl: "./ai-ocr.component.html",
    styleUrls: ["./ai-ocr.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AiOcrStore, LedgerComponentStore],
    standalone:false
})
export class AiOcrComponent implements OnInit, OnDestroy {
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store universalDate */
    public universalDate: any;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Holds company branches */
    public branches: Array<any>;
    /** True if is company */
    public isCompany: boolean = true;
    /** Subject to manage the unsubscription logic for observables to prevent memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Subject to manage the route scope */
    private routeScope$: Subject<void> = new Subject<void>();
    /** Interval ID for completed count */
    private completedIntervalId: any;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /** Holds local JSON data */
    public localeData: any = {};
    /** Holds common JSON data */
    public commonLocaleData: any = {};
    /** Stores signed URL response */
    public signedUrlResponse: any = {};
    /** Parameters for OCR documents request, used for pagination and filtering */
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
    /** Observable for the OCR documents list from the store */
    public ocrList$: Observable<any> = this.aiOcrStore.select((state) => state.ocrList);
    /** Observable indicating the progress state of the OCR documents list retrieval */
    public ocrListInProgress$: Observable<any> = this.aiOcrStore.select((state) => state.ocrListInProgress);
    /** Currently selected toggle option */
    public selectedToggle: string = '';
    /** Observable for OCR upload success state */
    public ocrUploadSuccess$: Observable<any> = this.aiOcrStore.ocrUploadSuccess$;
    /** Observable for OCR import success state */
    public ocrImportSuccess$: Observable<any> = this.aiOcrStore.ocrImportSuccess$;
    /** Observable for voucher import success state */
    public importVoucherSuccess$: Observable<any> = this.ledgerComponentStore.importVoucherSuccess$;
    /** File to be processed */
    public file: File;
    /** Count of items in the list */
    public listCount: number = 0;
    /** Observable for OCR completed count */
    public ocrCompletedCount$: Observable<number> = this.aiOcrStore.ocrCompletedCount$;
    /** Observable for OCR completed count in progress state */
    public ocrCompletedCountInProgress$: Observable<boolean> = this.aiOcrStore.ocrCompletedCountInProgress$;
    /** Variable to store count */
    public countVariable: number = 0;
    /** Flag to indicate if button is disabled */
    public buttonDisabled: boolean = true;
    /** Observable for OCR document extraction */
    public ocrExtractDocuments$: Observable<any> = this.aiOcrStore.ocrExtractDocuments$;
    /** Observable for OCR document extraction in progress state */
    public ocrExtractDocumentsInProgress$: Observable<boolean> = this.aiOcrStore.ocrExtractDocumentsInProgress$;
    /** Flag to indicate loading state */
    public isLoading: boolean = true;
    /** Local OCR list data */
    public ocrList: any;
    /** Main OCR list data */
    public ocrMainList: any;
    /** Observable for main OCR list in progress state */
    public ocrMainListInProgress$: Observable<boolean> = this.aiOcrStore.ocrMainListInProgress$;
    /** Observable for main OCR list */
    public ocrMainList$: Observable<any> = this.aiOcrStore.ocrMainList$;
    /** Observable for OCR upload in progress state */
    public ocrUploadInProgress$: Observable<boolean> = this.aiOcrStore.ocrUploadInProgress$;
    /** Current token for OCR operation */
    public ocrCurrentToken: string = "";
    /** Flag to indicate loading state */
    public innerLoading: boolean = false;
    /** Holds images folder path */
    public imgPath: string = "";
    /** Holds images folder path */
    public ocrAction = OcrAction;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Hold broadcast event */
    public broadcast: any;
    /** This will use for active company */
    public activeCompany: any = {};
    /** This will use for main page upload file */
    public mainPageUploadFile: boolean = false;
    /** This will use for ocr type */
    public ocrType: string = "";
    /** This will use for row data */
    public rowData: any;
    /** This will use for voucher type */
    public voucherType: string = "";
    /** This will use for ai ocr details */
    public aiOcrDetails: any;
    /** This will use for branch name */
    public branchName: string = "";

    constructor(
        private aiOcrStore: AiOcrStore,
        private ledgerComponentStore: LedgerComponentStore,
        private aiOcrService: AiOcrService,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(ServiceConfig) private serviceConfig
    ) {
        this.selectedToggle = OcrAction.List;
    }

    /**
     * Angular lifecycle method called on component initialization.
     * Initiates data retrieval and sets up subscriptions for store observables.
     * @memberof AiOcrComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(delay(100), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.aiOcrStore.reset();
                this.ledgerComponentStore.reset();
                setTimeout(() => {
                    this.resetData();
                }, 100);
                // End previous route scope and clear any existing interval before starting new scope
                this.routeScope$.next();
                this.routeScope$.complete();
                this.routeScope$ = new Subject<void>();
                if (this.completedIntervalId) {
                    clearInterval(this.completedIntervalId);
                    this.completedIntervalId = null;
                }
                // Reset local state on route change to avoid stale UI/state
                this.ocrType = "";
                this.mainPageUploadFile = false;
                this.listCount = 0;
                this.countVariable = 0;
                this.ocrType = response.type;
                // Redirect to default 'income' type if no type is provided or invalid
                if (!this.ocrType || (this.ocrType !== 'income' && this.ocrType !== 'expense')) {
                    this.router.navigate(['/pages/ai-ocr/income']);
                    return;
                }

                this.aiOcrStore.branchConsolidated$.pipe(takeUntil(this.routeScope$)).subscribe((response) => {
                    if (response) {
                        this.isConsolidatedBranch = response.isBranchConsolidated;
                        this.changeDetection.detectChanges();
                    }
                });
                this.aiOcrStore.branches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response) {
                        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
                    }
                });
                this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';

                this.ocrMainList$.pipe(takeUntil(this.routeScope$)).subscribe((res) => {
                    if (!res) {
                        return;
                    }
                    this.aiOcrService.mainPageOcrData$.next(res);
                    // Update list data
                    this.listCount = res.totalItems || 0;
                    this.ocrMainList = res;
                    // Get completed count only if we have items
                    if (this.listCount > 0) {
                        this.aiOcrStore.getCompletedCount(this.ocrType);
                    }
                    // Trigger change detection once after all updates
                    this.changeDetection.detectChanges();
                });



                this.ocrExtractDocuments$.pipe(takeUntil(this.routeScope$)).subscribe((res) => {
                    this.ocrCurrentToken = res?.token ? res.token : "";
                    this.aiOcrService.saveAndNext$.next(null);
                    this.aiOcrService.skipAndNext$.next(null);
                    if (res?.token) {
                        this.selectedToggle = OcrAction.Create;
                        this.aiOcrService.getOcrData$.next(true);
                        this.aiOcrService.aiOcrDetails$.next(res);
                        setTimeout(() => {
                            this.innerLoading = false;
                        }, 200);
                    } else {
                        this.aiOcrService.getOcrData$.next(false);
                        this.aiOcrService.aiOcrDetails$.next(null);
                        this.innerLoading = false;
                    }
                    this.changeDetection.detectChanges();
                });

                // Call getCompletedCount every 5 seconds
                this.completedIntervalId = setInterval(() => {
                    if (this.listCount > 0) {
                        this.aiOcrStore.getCompletedCount(this.ocrType);
                    }
                }, 5000);

                this.ocrMainListInProgress$.pipe(takeUntil(this.routeScope$)).subscribe((inProgress: boolean) => {
                    this.aiOcrService.ocrList$.next(this.ocrList);
                    this.isLoading = inProgress;
                    this.selectedToggle = OcrAction.List;
                    this.changeDetection.detectChanges();
                });

                // Update countVariable when the completed count is retrieved
                this.ocrCompletedCount$.pipe(takeUntil(this.routeScope$)).subscribe((count: number) => {
                    if (count != null) {
                        this.countVariable = count;
                        this.buttonDisabled = this.countVariable === 0 ? true : false;
                        this.changeDetection.detectChanges();
                    }
                });

                this.aiOcrService.dateRangeEmit$.pipe(takeUntil(this.destroyed$), takeUntil(this.routeScope$)).subscribe((res) => {
                    if (res) {
                        this.ocrDocumentsRequestParams = res;
                    }
                });

                // Disable or enable the button toggle based on the progress status
                this.ocrCompletedCountInProgress$.pipe(takeUntil(this.routeScope$)).subscribe((inProgress: boolean) => {
                    this.buttonDisabled = inProgress;
                    this.changeDetection.detectChanges();
                });

                if (this.selectedToggle === OcrAction.List) {
                    this.aiOcrStore.branches$.pipe(takeUntil(this.destroyed$)).subscribe(branchList => {
                        if (branchList) {
                            this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && branchList.length > 1;
                            if (!this.isCompany) {
                                this.ocrDocumentsRequestParams.branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
                            }
                            this.branches = [];
                            (Array.isArray(branchList) ? branchList : []).forEach((branch) => {
                                this.branches.push({
                                    label: branch?.name,
                                    value: branch?.uniqueName
                                });
                            });
                        }
                        this.changeDetection.detectChanges();
                    });

                    this.aiOcrService.sendListData$.pipe(takeUntil(this.routeScope$)).subscribe((response) => {
                        if (response) {
                            this.getListData(response);
                        }
                    });

                    this.aiOcrStore.activeCompany$.pipe(takeUntil(this.routeScope$)).subscribe((response) => {
                        if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                            this.activeCompany = response;
                        }
                        this.changeDetection.detectChanges();
                    });

                    /** Universal date observer */
                    this.aiOcrStore.universalDate$.pipe(takeUntil(this.routeScope$)).subscribe((dateObj) => {
                        if (dateObj) {
                            this.universalDate = cloneDeep(dateObj);
                            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                            this.selectedDateRangeUi =
                                dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) +
                                " - " +
                                dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            this.ocrDocumentsRequestParams.from = this.universalDate && this.universalDate[0] ? dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT) : "";
                            this.ocrDocumentsRequestParams.to = this.universalDate && this.universalDate[1] ? dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT) : "";
                            this.aiOcrService.mainPage$.next(false);
                            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                            this.getAllOcrDocuments(false);
                            this.changeDetection.detectChanges();

                        }
                    });
                }

                this.ocrUploadSuccess$.pipe(takeUntil(this.routeScope$)).subscribe((res) => {
                    if (!res) {
                        return;
                    }
                    this.signedUrlResponse = res;
                    this.ledgerComponentStore.uploadVoucher({
                        url: res.signedUrl,
                        file: this.file
                    });
                });

                this.ledgerComponentStore.uploadVoucherSuccess$
                    .pipe(takeUntil(this.routeScope$))
                    .subscribe((voucherResponse) => {
                        if (voucherResponse) {
                            this.aiOcrStore.importOcrDocument({
                                signedUrlResponse: this.signedUrlResponse,
                                ocrType: this.ocrType
                            });
                        }
                    });

                this.ocrImportSuccess$.pipe(takeUntil(this.routeScope$)).subscribe((res) => {
                    if (res && res.requestId) {
                        if (this.mainPageUploadFile) {
                            this.getAllOcrDocuments(false);
                        } else {
                            this.aiOcrService.uploadDataSuccess$.next(true);
                        }
                    }
                });

                this.aiOcrService.saveAndNextSuccess$.pipe(takeUntil(this.routeScope$)).subscribe((response) => {
                    if (response?.type === OcrAction.Save && response !== null) {
                        this.aiOcrService.saveAndNextSuccess$.next(null);
                        this.aiOcrService.skipAndNext$.next(null);
                        this.innerLoading = true;
                        this.aiOcrStore.getExtractDocuments(response ?? "");
                        this.aiOcrStore.getCompletedCount(this.ocrType);
                        this.changeDetection.detectChanges();
                    }
                });

                this.aiOcrService.skipAndNext$.pipe(takeUntil(this.routeScope$)).subscribe((response) => {
                    if (response?.type === OcrAction.Skip && response !== null) {
                        this.aiOcrService.saveAndNextSuccess$.next(null);
                        this.aiOcrService.skipAndNext$.next(null);
                        this.innerLoading = true;
                        this.aiOcrStore.getExtractDocuments({ type: OcrAction.Skip, token: response.token, ocrType: this.ocrType });
                        this.changeDetection.detectChanges();
                    }
                });

                this.aiOcrService.ocrListToCreate$.pipe(takeUntil(this.routeScope$)).subscribe((response) => {
                    if (response && response.type && response.row) {
                        this.rowData = response;
                        this.voucherType = null;
                        this.onToggleChange(OcrAction.Create, false);
                    } else if (response && response.type && response.row == null) {
                        this.voucherType = response.type;
                        this.rowData = null;
                        this.aiOcrDetails = response.aiOcrDetails;
                        this.onToggleChange(OcrAction.Create, false);
                    }
                });
            }
        });
    }

    /**
     * Retrieves all OCR documents.
     * @param resetPage - Indicates whether to reset the pagination page.
     * @memberof AiOcrComponent
     */
    public getAllOcrDocuments(resetPage: boolean): void {
        if (resetPage) {
            this.ocrDocumentsRequestParams.page = 1;
        }

        let reqObj = {
            convertedStatus: this.ocrDocumentsRequestParams.convertedStatus ?? null,
            fileName: this.ocrDocumentsRequestParams.fileName ?? null,
            status: this.ocrDocumentsRequestParams.status ?? null,
            uploadedBy: this.ocrDocumentsRequestParams.uploadedBy ?? null,
        };
        let request = {
            pagination: this.ocrDocumentsRequestParams,
            model: reqObj,
            ocrType: this.ocrType
        };
        this.aiOcrStore.getAllMainPageOcrData(request);
    }

    /**
     * Handles the toggle change event.
     * @param value - The toggle change value.
     * @memberof AiOcrComponent
     */
    public onChangeVoucher(value: OcrAction): void {
        if (value === OcrAction.Save) {
            this.aiOcrService.saveAndNext$.next(true);
        } else {
            this.innerLoading = true;
            this.aiOcrStore.getExtractDocuments({ type: OcrAction.Skip, token: this.ocrCurrentToken, ocrType: this.ocrType });
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Handles the toggle change event.
     * @param value - The toggle change value.
     * @param onClickCreate - Indicates whether the toggle change was triggered by a click on create.
     * @memberof AiOcrComponent
     */
    public onToggleChange(value: any, onClickCreate?: boolean): void {
        if (onClickCreate) {
            this.voucherType = null;
            this.rowData = null;
        }
        if (this.shouldPreventChange(value)) {
            return;
        }
        if (value === OcrAction.Create && !this.buttonDisabled) {
            this.selectedToggle = OcrAction.Create;
            if (this.rowData) {
                this.aiOcrStore.getExtractDocuments(this.rowData);
            } else if (this.voucherType) {
                const req = {
                    type: this.voucherType,
                    row: {
                        requestId: this.aiOcrDetails?.token
                    },
                    ocrType: this.ocrType
                }
                this.aiOcrService.ocrListToCreate$.next(null);
                this.aiOcrStore.getExtractDocuments(req);
            } else {
                this.aiOcrService.ocrListToCreate$.next(null);
                this.aiOcrStore.getExtractDocuments({ ocrType: this.ocrType });
            }
        } else if (value === OcrAction.List) {
            this.selectedToggle = value;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Determines whether the toggle change should be prevented.
     * @param value - The toggle change value.
     * @returns True if the change should be prevented, otherwise false.
     * @memberof AiOcrComponent
     */
    public shouldPreventChange(value: OcrAction): boolean {
        return value === OcrAction.Upload;
    }

    /**
     * Handles the file selection event.
     * @param event - The file selection event.
     * @memberof AiOcrComponent
     */
    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.file = file;
            this.aiOcrStore.uploadOcrDocument({ fileName: file.name });
        }
    }

    /**
     * Initiates the file upload dialog.
     * @param event - The event triggering the upload.
     * @param fileInput - The file input element.
     * @memberof AiOcrComponent
     */
    public onUploadFile(event: any, fileInput: HTMLInputElement, mainUpload: boolean): void {
        this.mainPageUploadFile = mainUpload;
        // Trigger file input dialog if event exists
        if (event) {
            fileInput.value = "";
            fileInput.click();
        }
    }

    /**
     * This will use for go to branch mode
     *
     * @memberof AiOcrComponent
     */
    public gotToBranchTab(): void {
        this.broadcast = new BroadcastChannel("ai-ocr");
        this.broadcast.postMessage({ success: true });
    }

    /**
     * Callback for date/range selection in datepicker.
     *
     * @param {*} [value]
     * @param {*} [from]
     * @return {*} {void}
     * @memberof AiOcrComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            // Cancel any ongoing operations first
            this.aiOcrStore.reset();

            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi =
                dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) +
                " - " +
                dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.ocrDocumentsRequestParams.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.ocrDocumentsRequestParams.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);

            // Reset service subjects to prevent multiple subscriptions
            this.aiOcrService.resetData$.next(null);
            this.aiOcrService.mainPage$.next(false);
            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);

            // Trigger fresh data load with debouncing
            this.showClearFilter = true;
            this.getAllOcrDocuments(false);
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will show the datepicker
     *
     * @param {boolean} isOpen
     * @memberof AiOcrComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * This will use to reset the data.
     *
     * @memberof AiOcrComponent
     */
    public resetData(): void {
        this.showClearFilter = false;

        // Cancel any ongoing operations by resetting store state
        this.aiOcrStore.reset();
        this.ledgerComponentStore.reset();
        // Reset loading states to prevent UI inconsistencies
        this.isLoading = false;
        this.innerLoading = false;
        this.buttonDisabled = true;

        // Clear current data
        this.ocrList = null;
        this.ocrMainList = null;
        this.countVariable = 0;
        this.ocrCurrentToken = "";

        // Reset service subjects to cancel any pending operations
        this.aiOcrService.getOcrData$.next(null);
        this.aiOcrService.dateRangeEmit$.next(null);
        this.aiOcrService.sendListData$.next(null);
        this.aiOcrService.resetData$.next(null);
        this.aiOcrService.selectBranch$.next(null);
        this.aiOcrService.ocrList$.next(null);
        this.aiOcrService.aiOcrDetails$.next(null);
        this.aiOcrService.mainPage$.next(null);
        this.aiOcrService.uploadDataSuccess$.next(null);
        this.aiOcrService.saveAndNext$.next(null);
        this.aiOcrService.skipAndNext$.next(null);
        this.aiOcrService.saveAndNextSuccess$.next(null);
        this.aiOcrService.ocrListToCreate$.next(null);
        this.aiOcrService.mainPageOcrData$.next(null);

        // Reset to universal date range - use take(1) to prevent multiple subscriptions
        this.aiOcrStore.universalDate$.pipe(
            takeUntil(this.routeScope$),
            take(1)
        ).subscribe((dateObj) => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi =
                    dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) +
                    " - " +
                    dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.ocrDocumentsRequestParams.from = this.universalDate && this.universalDate[0] ? dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT) : "";
                this.ocrDocumentsRequestParams.to = this.universalDate && this.universalDate[1] ? dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT) : "";

                // Clear branch filter
                this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                this.aiOcrService.mainPage$.next(false);
                // Trigger fresh data load with reset parameters
                // Create new object for OCR documents request parameters
                const newOcrDocumentsRequestParams = {
                    from: this.ocrDocumentsRequestParams.from,
                    to: this.ocrDocumentsRequestParams.to,
                    count: PAGINATION_LIMIT,
                    page: 1,
                    sort: "desc",
                    sortBy: "DATE",
                    convertedStatus: null,
                    fileName: null,
                    status: null,
                    uploadedBy: null,
                    branchUniqueName: this.isCompany ? "" : (this.generalService.currentBranchUniqueName ?? "")
                };
                // Reset existing object
                this.ocrDocumentsRequestParams = { ...newOcrDocumentsRequestParams };
                this.showClearFilter = false;
                this.getAllOcrDocuments(true);
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * This will use to get list data.
     *
     * @param {boolean} resetPage
     * @memberof AiOcrComponent
     */
    public getListData(data: any): void {
        if (data.user || data.fileName || data.status || data.convertedStatus || data.uploadedBy) {
            this.ocrDocumentsRequestParams['fileName'] = data.fileName;
            this.ocrDocumentsRequestParams['status'] = data.status;
            this.ocrDocumentsRequestParams['convertedStatus'] = data.convertedStatus;
            this.ocrDocumentsRequestParams['uploadedBy'] = data.uploadedBy;
            this.showClearFilter = true;
        } else {
            this.showClearFilter = false;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * This will use to send data.
     * @param event
     * @memberof AiOcrComponent
     */
    public selectBranch(event: any): void {
        this.showClearFilter = true;
        this.aiOcrService.resetData$.next(null);
        this.aiOcrService.selectBranch$.next(this.ocrDocumentsRequestParams);
        this.branchName = event?.label;
    }

    /**
     * Angular lifecycle method called on component destruction.
     * Completes the destroyed$ subject to unsubscribe from observables.
     * @memberof AiOcrComponent
     */
    public ngOnDestroy(): void {
        this.aiOcrService.getOcrData$.next(null);
        this.aiOcrService.ocrList$.next(null);
        this.aiOcrService.aiOcrDetails$.next(null);
        this.aiOcrService.uploadDataSuccess$.next(null);
        this.aiOcrService.saveAndNext$.next(null);
        this.aiOcrService.skipAndNext$.next(null);
        this.aiOcrService.dateRangeEmit$.next(null);
        this.aiOcrService.sendListData$.next(null);
        this.aiOcrService.resetData$.next(null);
        this.aiOcrService.selectBranch$.next(null);
        if (this.completedIntervalId) {
            clearInterval(this.completedIntervalId);
            this.completedIntervalId = null;
        }
        if (this.broadcast) {
            try { this.broadcast.close?.(); } catch { }
            this.broadcast = null;
        }
        this.routeScope$.next();
        this.routeScope$.complete();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
