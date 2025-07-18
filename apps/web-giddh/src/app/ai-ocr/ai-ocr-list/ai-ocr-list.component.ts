import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { debounceTime, distinctUntilChanged, Observable, ReplaySubject, takeUntil } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FormBuilder, FormGroup } from "@angular/forms";
import { GeneralService } from "../../services/general.service";
import { API_COUNT_LIMIT, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS } from "../../app.constant";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import * as dayjs from "dayjs";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { MatSort, Sort } from "@angular/material/sort";
import { AiOcrStore } from "../utility/ai-ocr.store";
import { AiOcrService } from "../../services/ai-ocr.service";
import { OrganizationType } from "../../models/user-login-state";
import { AppState } from "../../store";
import { Store } from "@ngrx/store";
import { GeneralActions } from "../../actions/general/general.actions";

@Component({
    selector: "ai-ocr-list",
    templateUrl: "./ai-ocr-list.component.html",
    styleUrls: ["./ai-ocr-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AiOcrStore],
})
export class AiOcrListComponent implements OnInit, OnDestroy {
    /** Holds table sorting reference */
    @ViewChild(MatSort) sortBy: MatSort;
    /** Directive to get reference of element */
    @ViewChild("datepickerTemplate") public datepickerTemplate: TemplateRef<any>;
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ["date", "fileName", "uploadedBy", "fileStatus", "convertedStatus"];
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
        count: API_COUNT_LIMIT,
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
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
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
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
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
    /** Hold broadcast event */
    public broadcast: any;

    constructor(
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private componentStore: AiOcrStore,
        private aiOcrService: AiOcrService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private generalActions: GeneralActions
    ) {
    }

    /**
     * Initializes the component by subscribing to route parameters and fetching ocr data.
     *
     * @memberof AiOcrListComponent
     */
    public ngOnInit(): void {
        this.initForm();

        /** Universal date observer */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe((dateObj) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi =
                    dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) +
                    " - " +
                    dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.ocrDocumentsRequestParams.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.ocrDocumentsRequestParams.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAllOcrDocuments(false);
            }
        });

        /** Get Ocr List */
        this.ocrList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.store.dispatch(this.generalActions.openSideMenu(true));
            if (response?.items) {
                this.dataSource = new MatTableDataSource<any>(response?.items);
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
                this.ocrDocumentsRequestParams.totalItems = response?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.showData = false;
                this.ocrDocumentsRequestParams.totalItems = 0;
            }
        });

        this.aiOcrService.uploadDataSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.getAllOcrDocuments(false);
            }
        });

        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && this.activeCompany?.uniqueName !== response?.uniqueName) {
                this.activeCompany = response;
            }
        });

        this.componentStore.branches$.pipe(takeUntil(this.destroyed$)).subscribe(branchList => {
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

        this.ocrDocumentListForm?.controls["status"].valueChanges
            .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                if (this.isNotNullOrUndefined(searchedText)) {
                    this.showClearFilter = true;
                    this.getAllOcrDocuments(true);
                }
                if (this.isNullOrEmpty(searchedText)) {
                    this.showClearFilter = false;
                    this.showStatus = false;
                }
            });

        this.ocrDocumentListForm?.controls["convertedStatus"].valueChanges
            .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                if (this.isNotNullOrUndefined(searchedText)) {
                    this.showClearFilter = true;
                    this.getAllOcrDocuments(true);
                }
                if (this.isNullOrEmpty(searchedText)) {
                    this.showClearFilter = false;
                    this.showconvertedStatus = false;
                }
            });

        this.ocrDocumentListForm?.controls["uploadedBy"].valueChanges
            .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
                if (this.isNotNullOrUndefined(searchedText)) {
                    this.showClearFilter = true;
                    this.getAllOcrDocuments(true);
                }
                if (this.isNullOrEmpty(searchedText)) {
                    this.showClearFilter = false;
                    this.showUploadedBy = false;
                }
            });

        this.ocrDocumentListForm?.controls["fileName"].valueChanges
            .pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((searchedText) => {
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
     * This will hide the datepicker.
     *
     * @memberof AiOcrListComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef?.hide();
    }

    /**
     * Callback for date/range selection in datepicker.
     *
     * @param {*} [value]
     * @param {*} [from]
     * @return {*} {void}
     * @memberof AiOcrListComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.showClearFilter = true;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi =
                dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) +
                " - " +
                dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.ocrDocumentsRequestParams.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.ocrDocumentsRequestParams.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getAllOcrDocuments(true);
        }
    }

    /**
     * To show the datepicker.
     *
     * @param {*} element
     * @memberof AiOcrListComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: "modal-lg giddh-datepicker-modal", backdrop: false, ignoreBackdropClick: false })
        );
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
    public handlePageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.ocrDocumentsRequestParams.count = event.pageSize;
        this.ocrDocumentsRequestParams.page = event.pageIndex + 1;
        this.getAllOcrDocuments(false);
    }

    /**
     * Clears the filters and resets the form in the AiOcrListComponent.
     *
     * @memberof AiOcrListComponent
     */
    public clearFilter(): void {
        this.showClearFilter = false;
        this.showStatus = false;
        this.showUploadedBy = false;
        this.showFileName = false;
        this.ocrDocumentListForm.patchValue({
            status: null,
            fileName: null,
            uploadedBy: null,
            convertedStatus: null,
        });
        this.inlineSearch = "";
        /** Universal date observer */
        this.componentStore.universalDate$.subscribe((dateObj) => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi =
                    dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) +
                    " - " +
                    dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.ocrDocumentsRequestParams.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.ocrDocumentsRequestParams.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAllOcrDocuments(true);
            }
        });
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
        };
        this.componentStore.getAllOcrList(request);
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
        }
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Completes the subject indicating component destruction.
     *
     * @memberof AiOcrListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
