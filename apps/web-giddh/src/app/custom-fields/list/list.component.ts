import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { PAGINATION_LIMIT } from "../../app.constant";
import { CustomFieldsService } from "../../services/custom-fields.service";
import { ToasterService } from "../../services/toaster.service";
import { ConfirmModalComponent } from "../../theme/new-confirm-modal/confirm-modal.component";
import { FieldModules } from "../custom-fields.constant";

export interface CustomFieldsInterface {
    fieldName: string;
    fieldType: any;
    isMandatory: boolean;
    uniqueName: string;
}

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
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
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 1,
        count: PAGINATION_LIMIT,
        moduleUniqueName: 'stock'
    };
    /** Holds get all custom fields api response */
    public customFieldsList: any = {};
    /** Available field modules list */
    public fieldModules: any[] = [];
    /** True if translations are loaded */
    public translationsLoaded: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private toasterService: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        private customFieldsService: CustomFieldsService,
        private dialog: MatDialog
    ) {

    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof CustomFieldsListComponent
     */
    public ngOnInit(): void {
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
            if (response) {
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
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.delete_custom_field_title,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.customFieldsService.delete(customFieldUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
     * Page change event handler
     *
     * @param {PageChangedEvent} event Page changed event
     * @memberof CustomFieldsListComponent 
     */
    public pageChanged(event: PageChangedEvent): void {
        this.customFieldsRequest.page = event.page;
        this.getCustomFields();
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof CustomFieldsListComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.fieldModules = [
                { name: this.localeData?.modules?.account, uniqueName: FieldModules.Account },
                { name: this.localeData?.modules?.stock, uniqueName: FieldModules.Stock },
                { name: this.localeData?.modules?.group, uniqueName: FieldModules.Group }
            ];
            this.translationsLoaded = true;
            this.changeDetectorRef.detectChanges();
        }
    }
}