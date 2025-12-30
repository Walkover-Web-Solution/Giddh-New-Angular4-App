import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PAGINATION_LIMIT, PAGE_SIZE_OPTIONS, IOption } from '../../../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { IAllTransporterDetails } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { get, set } from '../../../../lodash-optimized';

export interface transporterDetails {
    name: string;
    transporterId: string;
    action: string;
}
const ELEMENT_DATA: transporterDetails[] = [];
@Component({
    selector: 'aside-manage-transport',

    templateUrl: './aside-manage-transport.component.html',
    standalone: false,
    styleUrls: ['./aside-manage-transport.component.scss']
})
export class AsideManageTransportComponent implements OnInit {
    /** Dialog Ref for update ledger */
    public confirmModalDialogRef: any;
    /** This will use for displayed table columns*/
    public displayedColumns: string[] = ['name', 'transporterId', 'action'];
    /** Hold  transporter id*/
    public currentTransporterId: string;
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Hold table data*/
    public dataSource: any[] = ELEMENT_DATA;
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold local JSON data */
    public localeData: any = {};
    /**True if transport edit mode*/
    public transportEditMode: boolean = false;
    /** Hold transported mode list */
    public transporterMode: IOption[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold get transporter details*/
    public transporterListDetails: IAllTransporterDetails;
    /** Form Group for group form */
    public transportedCreateEditForm: UntypedFormGroup;
    /** Holds if form is valid or not */
    public isValidForm: boolean = true;
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** This will use for transporter logs object */
    public transporterObj = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalPages: 0,
        totalItems: 0
    }

    constructor(
        private changeDetection: ChangeDetectorRef,
        private formBuilder: UntypedFormBuilder,
        private invoiceServices: InvoiceService,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private toasty: ToasterService) {
    }

    /**
     * This will use for component initialization
     *
     * @memberof AsideManageTransportComponent
     */
    public ngOnInit(): void {
        this.initTransporterForm();
        this.getTransportersList();
    }

    /**
     * This will use for initialization form
     *
     * @private
     * @memberof AsideManageTransportComponent
     */
    private initTransporterForm(): void {
        this.transportedCreateEditForm = this.formBuilder.group({
            transporterId: ['', Validators.required],
            transporterName: ['', Validators.required]
        });
    }


    /**
    * This will use for page change
    *
    * @param {*} event
    * @memberof AsideManageTransportComponent
    */
    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof AsideManageTransportComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.transporterObj.page = this.transporterObj.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.transporterObj.count = event.pageSize;
        this.getTransportersList();
        this.detectChanges();
    }

    /**
     * This will use for generate form
     *
     * @param {*} generateTransporterForm
     * @memberof AsideManageTransportComponent
     */
    public generateTransporter(generateTransporterForm: any): void {
        this.isValidForm = !this.transportedCreateEditForm.invalid;
        if (this.isValidForm) {
            this.invoiceServices.addEwayTransporter(generateTransporterForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response && response.status === "success" && response.body) {
                    this.toasty.showSnackBar("success", 'Transported created successfully');
                    this.clearTransportForm();
                    this.getTransportersList();
                } else {
                    this.toasty.showSnackBar("error", response.message);
                }
            });
        }
        this.detectChanges();
    }

    /**
     * This will use for get transporter list
     *
     * @memberof AsideManageTransportComponent
     */
    public getTransportersList(): void {
        this.isLoading = true;
        this.invoiceServices.getAllTransporterList(this.transporterObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.status === "success" && response.body) {
                this.transporterListDetails = response.body.results;
                this.transporterObj.totalItems = response.body?.totalItems;
                this.transporterObj.totalPages = response.body?.totalPages;
            } else {
                this.dataSource = [];
                this.transporterObj.totalItems = 0;
            }
        });
        this.detectChanges();
    }

    /**
     * This will use for update transporter update
     *
     * @param {*} generateTransporterForm
     * @memberof AsideManageTransportComponent
     */
    public updateTransporter(generateTransporterForm: any): void {
        this.isLoading = true;
        this.invoiceServices.UpdateGeneratedTransporter(this.currentTransporterId, generateTransporterForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.status === "success" && response.body) {
                this.toasty.successToast('Transporter updated successfully');
                this.transportEditMode = false;
                this.clearTransportForm();
                this.getTransportersList();
            } else {
                this.toasty.showSnackBar("error", response.message);
            }
        });
        this.detectChanges();
    }

    /**
     * This will use for clear form
     *
     * @memberof AsideManageTransportComponent
     */
    public clearTransportForm(): void {
        this.transportedCreateEditForm?.reset();
        this.isValidForm = true;
        this.transportEditMode = false;
        this.detectChanges();
    }

    /**
     * This will use for edit transporter
     *
     * @param {*} transporter
     * @memberof AsideManageTransportComponent
     */
    public editTransporter(transporter: any): void {
        this.transportEditMode = true;
        if (transporter !== undefined && transporter) {
            this.transportedCreateEditForm.get('transporterId').setValue(transporter.transporterId);
            this.transportedCreateEditForm.get('transporterName').setValue(transporter.transporterName);
            this.currentTransporterId = transporter.transporterId;
        }
        this.detectChanges();
    }


    /**
     * This will be use for delete transporter
     *
     * @param {*} transporter
     * @memberof AsideManageTransportComponent
     */
    public deleteTransporter(transporter: any): void {
        this.confirmModalDialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '585px',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: 'Are you sure you want to delete the transporter?',
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        this.confirmModalDialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.isLoading = true
                this.invoiceServices.deleteTransporterById(transporter.transporterId).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isLoading = false;
                    if (response && response.status === "success" && response.body) {
                        this.toasty.showSnackBar("success", response.body);
                        this.transporterObj.page = this.generalService.adjustPageIndex(this.transporterObj.totalItems, this.transporterObj.page, this.transporterObj.count);
                        this.getTransportersList();
                    } else {
                        this.toasty.showSnackBar("error", response.message);
                    }
                });
            }
        });
    }

    /**
     * This will be use for detecting changes
     *
     * @memberof AsideManageTransportComponent
     */
    public detectChanges(): void {
        if (!this.changeDetection['destroyed']) {
            this.changeDetection.detectChanges();
        }
    }

    /**
     * This will be use for component destroyed
     *
     * @memberof AsideManageTransportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
