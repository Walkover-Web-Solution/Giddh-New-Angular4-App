import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { IAllTransporterDetails } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { ReplaySubject, takeUntil } from 'rxjs';

export interface transporterDetails {
    name: string;
    transportid: string;
    action: string;
}
const ELEMENT_DATA: transporterDetails[] = [];
@Component({
    selector: 'aside-manage-transport',
    templateUrl: './aside-manage-transport.component.html',
    styleUrls: ['./aside-manage-transport.component.scss']
})
export class AsideManageTransportComponent implements OnInit {
    /** Emits modal close event */

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** This will use for displayed table columns*/
    public displayedColumns: string[] = ['name', 'transportid', 'action'];
    /** Hold  transporter id*/
    public currenTransporterId: string;
    /** Hold table data*/
    public dataSource = ELEMENT_DATA;
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
     * Closes aside pane
     *
     *
     * @memberof AsideManageTransportComponent
     */
    public closeAsidePane() {
        this.closeAsideEvent.emit();
    }

    /**
    * This will use for page change
    *
    * @param {*} event
    * @memberof AsideManageTransportComponent
    */
    public pageChanged(event: any): void {
        if (this.transporterObj.page !== event.page) {
            this.transporterObj.page = event.page;
            this.getTransportersList();
        }
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
                    this.toasty.successToast('Transported created successfully');
                    this.closeAsideEvent.emit();
                    this.clearTransportForm();
                    this.getTransportersList();
                } else {
                    this.toasty.errorToast(response.message);
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
            this.isLoading = false;;
            if (response && response.status === "success" && response.body) {
                this.transporterListDetails = response.body.results;
                this.transporterObj.page = response.body?.page;
                this.transporterObj.totalItems = response.body?.totalItems;
                this.transporterObj.totalPages = response.body?.totalPages;
                this.transporterObj.count = response.body?.count;
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
        this.invoiceServices.UpdateGeneratedTransporter(this.currenTransporterId, generateTransporterForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;;
            if (response && response.status === "success" && response.body) {
                this.toasty.successToast('Transporter updated successfully');
                this.transportEditMode = false;
                this.clearTransportForm();
                this.getTransportersList();
            } else {
                this.toasty.errorToast(response.message);
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
            this.currenTransporterId = transporter.transporterId;
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
        this.isLoading = true;
        this.invoiceServices.deleteTransporterById(transporter.transporterId).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;;
            if (response && response.status === "success" && response.body) {
                this.toasty.successToast(response.body);
                this.getTransportersList();
            } else {
                this.toasty.errorToast(response.message);
            }
        });
        this.detectChanges();
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
