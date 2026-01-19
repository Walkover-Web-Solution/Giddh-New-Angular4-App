import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../app.constant";
import { CustomFieldsService } from "../../services/custom-fields.service";
import { ToasterService } from "../../services/toaster.service";
import { ConfirmModalComponent } from "../../theme/new-confirm-modal/confirm-modal.component";
import { FieldModules } from "../custom-fields.constant";
import { GeneralService } from "../../services/general.service";
import { map } from '../../lodash-optimized';

/**
 * CustomFieldsInterface interface definition
 * Defines the structure and contract for CustomFieldsInterface objects
 */
export interface CustomFieldsInterface {
    fieldName: string;
    fieldType: any;
    isMandatory: boolean;
    uniqueName: string;
}

/**
 * Handles Component functionality
 */
@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * CustomFieldsListComponent component
 * Handles customfieldslist functionality and user interactions
 */
export class CustomFieldsListComponent implements OnInit, OnDestroy {
    /** List of columns in table */
    public displayedColumns: string[] = ['serialNo', 'fieldName', 'fieldType', 'isMandatory', 'action'];
    /** Data source of table */
    public dataSource: CustomFieldsInterface[] = [];
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Loader for API request */
    public isLoading: boolean = true;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 1,
        count: PAGINATION_LIMIT,
        moduleUniqueName: ''
    };
    /** Holds get all custom fields api response */
    public customFieldsList: any = {};
    /** Available field modules list */
    public fieldModules: IOption[] = [];
    /** True if translations are loaded */
    public translationsLoaded: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private toasterService: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        private customFieldsService: CustomFieldsService,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) {

    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof CustomFieldsListComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.customFieldsRequest.moduleUniqueName = 'account';
        this.getCustomFields();
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof CustomFieldsListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Get list of custom fields
     *
     * @memberof CustomFieldsListComponent
     */
    public getCustomFields(): void {
        this.customFieldsService.list(this.customFieldsRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                /**
                 * Handles if functionality
                 */
                if (response.status === 'success') {
                    this.customFieldsList = response.body;
                    this.dataSource = response.body?.results?.map((result, index) => {
                        result.index = index + 1;
                        return result;
                    });
                } else if (response.message) {
                    this.toasterService.errorToast(response.message);
                }
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * Delete custom field
     *
     * @param {*} customFieldUniqueName
     * @memberof CustomFieldsListComponent
     */
    public deleteCustomField(customFieldUniqueName: any): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '500px',
                    role: 'alertdialog',
                    ariaLabel: 'Confirm Dialog',
                    data: {
                title: this.commonLocaleData?.app_delete,
                    body: this.localeData?.delete_custom_field_title,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.customFieldsService.delete(customFieldUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    /**
                     * Handles if functionality
                     */
                    if (response?.status === "success") {
                        this.toasterService.showSnackBar("success", this.localeData?.custom_field_deleted);
                        this.getCustomFields();
                    } else {
                        this.toasterService.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof CustomFieldsListComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.customFieldsRequest.page = this.customFieldsRequest.count !== event.pageSize? 1 : event.pageIndex + 1;
        this.customFieldsRequest.count = event.pageSize;
        this.getCustomFields();
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof CustomFieldsListComponent
     */
    public translationComplete(event: boolean): void {
        /**
         * Handles if functionality
         */
        if (event) {
            /**
             * Handles if functionality
             */
            if (this.voucherApiVersion === 2) {
                this.fieldModules = [
                    { label: this.localeData?.modules?.account, value: FieldModules.Account },
                    { label: this.commonLocaleData.app_variant, value: FieldModules.Variant }
                ];
            } else {
                this.fieldModules = [
                    { label: this.localeData?.modules?.account, value: FieldModules.Account }
                ];
            }
            this.translationsLoaded = true;
            this.changeDetectorRef.detectChanges();
        }
    }
}
