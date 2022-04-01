import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PAGINATION_LIMIT } from "../../app.constant";
import { CustomFieldsService } from "../../services/custom-fields.service";
import { ToasterService } from "../../services/toaster.service";

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
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private toasterService: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        private customFieldsService: CustomFieldsService
    ) {

    }

    public ngOnInit(): void {
        this.getCustomFields();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

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

    public deleteCustomField(customFieldUniqueName: any): void {
        this.customFieldsService.delete(customFieldUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            //this.modalRef?.hide();
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.custom_field_deleted);
                this.getCustomFields();
            } else {
                this.toasterService.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Page change event handler
     *
     * @param {PageChangedEvent} event Page changed event
     * @memberof CustomFieldsComponent
     */
    public pageChanged(event: PageChangedEvent): void {
        this.customFieldsRequest.page = event.page;
        this.getCustomFields();
    }
}