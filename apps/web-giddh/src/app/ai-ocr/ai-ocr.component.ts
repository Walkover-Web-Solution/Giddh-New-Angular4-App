import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, ReplaySubject, takeUntil } from "rxjs";
import { MatMenuTrigger } from "@angular/material/menu";
import { API_COUNT_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES } from "../app.constant";
import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import { AiOcrStore } from "./utility/ai-ocr.store";
import { LedgerComponentStore } from "../ledger/ledger.store";
import { AiOcrService } from "../services/ai-ocr.service";
import { GeneralService } from "../services/general.service";
import { OrganizationType } from "../models/user-login-state";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../shared/helpers/defaultDateFormat";
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
        count: API_COUNT_LIMIT,
        from: "",
        to: "",
        sort: "",
        sortBy: "",
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

    constructor(
        private aiOcrStore: AiOcrStore,
        private ledgerComponentStore: LedgerComponentStore,
        private aiOcrService: AiOcrService,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
    ) {
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
        this.selectedToggle = OcrAction.List;
    }

    /**
     * Angular lifecycle method called on component initialization.
     * Initiates data retrieval and sets up subscriptions for store observables.
     * @memberof AiOcrComponent
     */
    public ngOnInit(): void {
        this.aiOcrStore.branchConsolidated$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
                this.changeDetection.detectChanges();
            }
        });
        this.aiOcrStore.branches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
                this.changeDetection.detectChanges();
            }
        });
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
        this.getAllOcrDocuments(false);

        this.ocrMainList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.listCount = res?.totalItems;
                this.ocrMainList = res;
                this.changeDetection.detectChanges();
            }
            if (this.listCount > 0) {
                this.aiOcrStore.getCompletedCount(null);
            }
        });

        this.ocrExtractDocuments$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
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
        setInterval(() => {
            if (this.listCount > 0) {
                this.aiOcrStore.getCompletedCount(null);
            }
        }, 5000);

        this.ocrMainListInProgress$.pipe(takeUntil(this.destroyed$)).subscribe((inProgress: boolean) => {
            this.aiOcrService.ocrList$.next(this.ocrList);
            this.isLoading = inProgress;
            this.selectedToggle = OcrAction.List;
            this.changeDetection.detectChanges();
        });

        // Update countVariable when the completed count is retrieved
        this.ocrCompletedCount$.pipe(takeUntil(this.destroyed$)).subscribe((count: number) => {
            if (count != null) {
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

        if (this.selectedToggle === OcrAction.List) {
            this.aiOcrStore.branches$.pipe(takeUntil(this.destroyed$)).subscribe(branchList => {
                if (branchList) {
                    this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && branchList.length > 1;
                    if (!this.isCompany) {
                        this.ocrDocumentsRequestParams.branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
                    }
                    this.branches = [];
                    branchList.forEach((branch) => {
                        this.branches.push({
                            label: branch?.name,
                            value: branch?.uniqueName
                        });
                    });
                }
            });

            this.aiOcrService.sendListData$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response) {
                    this.getListData(response);
                }
            });

            this.aiOcrStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                    this.activeCompany = response;
                }
            });

            /** Universal date observer */
            this.aiOcrStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe((dateObj) => {
                if (dateObj) {
                    this.universalDate = _.cloneDeep(dateObj);
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi =
                        dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) +
                        " - " +
                        dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.ocrDocumentsRequestParams.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.ocrDocumentsRequestParams.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
                }
            });
        }

        this.ocrUploadSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.signedUrlResponse = res;
                this.ledgerComponentStore.uploadVoucher({ url: res.signedUrl, file: this.file });
            }
        });

        this.ledgerComponentStore.uploadVoucherSuccess$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((voucherResponse) => {
                if (voucherResponse) {
                    this.aiOcrStore.importOcrDocument(this.signedUrlResponse);
                }
            });

        this.ocrImportSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.getAllOcrDocuments(false);
                this.aiOcrService.uploadDataSuccess$.next(true);
            }
        });

        this.aiOcrService.saveAndNextSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.type === OcrAction.Save && response !== null) {
                this.aiOcrService.saveAndNextSuccess$.next(null);
                this.aiOcrService.skipAndNext$.next(null);
                this.innerLoading = true;
                this.aiOcrStore.getExtractDocuments(response ?? "");
                this.aiOcrStore.getCompletedCount(null);
                this.changeDetection.detectChanges();
            }
        });

        this.aiOcrService.skipAndNext$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.type === OcrAction.Skip && response !== null) {
                this.aiOcrService.saveAndNextSuccess$.next(null);
                this.aiOcrService.skipAndNext$.next(null);
                this.innerLoading = true;
                this.aiOcrStore.getExtractDocuments({ type: OcrAction.Skip, token: response.token });
            }
            this.changeDetection.detectChanges();
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
            convertedStatus: null,
            fileName: null,
            status: null,
            uploadedBy: null,
        };
        let request = {
            pagination: this.ocrDocumentsRequestParams,
            model: reqObj,
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
            this.aiOcrStore.getExtractDocuments({ type: OcrAction.Skip, token: this.ocrCurrentToken });
        }
        this.changeDetection.detectChanges();
    }

    /**
     * Handles the toggle change event.
     * @param value - The toggle change value.
     * @memberof AiOcrComponent
     */
    public onToggleChange(value: any): void {
        if (this.shouldPreventChange(value)) {
            return;
        }
        if (value === OcrAction.Create && !this.buttonDisabled) {
            this.aiOcrStore.getExtractDocuments("");
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
    public onUploadFile(event: any, fileInput: HTMLInputElement): void {
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
    public dateSelectedCallback(value?: any, from?: any): void {
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
            this.showClearFilter = true;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi =
                dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) +
                " - " +
                dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.ocrDocumentsRequestParams.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.ocrDocumentsRequestParams.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.aiOcrService.dateRangeEmit$.next(this.ocrDocumentsRequestParams);
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
        /** Universal date observer */
        this.aiOcrStore.universalDate$.subscribe((dateObj) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi =
                    dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) +
                    " - " +
                    dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.ocrDocumentsRequestParams.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.ocrDocumentsRequestParams.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.aiOcrService.resetData$.next(this.ocrDocumentsRequestParams);
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
            this.showClearFilter = true;
        } else {
            this.showClearFilter = false;
        }
        this.changeDetection.detectChanges();
    }

    /**
     * This will use to send data.
     *
     * @memberof AiOcrComponent
     */
    public selectBranch(): void {
        this.aiOcrService.selectBranch$.next(this.ocrDocumentsRequestParams);
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
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
