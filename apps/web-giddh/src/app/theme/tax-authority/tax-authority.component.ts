import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../services/general.service';
import { TaxAuthorityComponentStore } from './utility/tax-authority.store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateComponent } from './create/create.component';

@Component({
    selector: 'tax-authority',
    templateUrl: './tax-authority.component.html',
    styleUrls: ['./tax-authority.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class TaxAuthorityComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds table columns */
    public displayedColumns = ['name', 'uniqueName', 'description', 'action'];
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';

     /** Loading Observable */
     public isLoading$: Observable<any> = this.componentStore.isLoading$;
     /** Tax Authority List Observable */
     public taxAuthorityList$: Observable<any> = this.componentStore.taxAuthorityList$;
     /** Delete Tax Authority is success Observable */
     public deleteTaxAuthorityIsSuccess$: Observable<any> = this.componentStore.deleteTaxAuthorityIsSuccess$;
     /** Create Tax Authority is success Observable */
     public createTaxAuthorityIsSuccess$: Observable<any> = this.componentStore.createTaxAuthorityIsSuccess$;
     /** Update Tax Authority is success Observable */
     public updateTaxAuthorityIsSuccess$: Observable<any> = this.componentStore.updateTaxAuthorityIsSuccess$;

     private createTaxAuthorityDialogRef: MatDialogRef<any>;

    constructor(
        private componentStore: TaxAuthorityComponentStore,
        private dialog: MatDialog
    ) { }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof TaxAuthorityComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.getTaxAuthority();
        this.subscribeAllStoreObservable();
    }

    /**
     * Subscribe store Observable
     *
     * @private
     * @memberof TaxAuthorityComponent
     */
    private subscribeAllStoreObservable(): void {
        // Subscribe Tax Authority List
        this.taxAuthorityList$.pipe(takeUntil(this.destroyed$)).subscribe( response => {
            if(response) {
                console.log("taxAuthorityList", response);
            }
        });

        // Subscribe Create Tax Authority Success
        this.createTaxAuthorityIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe( response => {
            if(response) {
                this.createTaxAuthorityDialogRef.close();
                console.log("Create", response);
            }
        });

        // Subscribe Update Tax Authority Success
        this.updateTaxAuthorityIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe( response => {
            if(response) {
                console.log("Update", response);
            }
        });

        // Subscribe Delete Tax Authority Success
        this.deleteTaxAuthorityIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe( response => {
            if(response) {
                console.log("Delete", response);
            }
        });
    }

    /**
    * Get Tax Authority API Call
    *
    * @memberof TaxAuthorityComponent
    */
    public getTaxAuthority(): void {
        this.componentStore.getTaxAuthorityList();
    }

    /**
     * Open Create Tax Authority dialog
     *
     * @memberof TaxAuthorityComponent
     */
    public openCreateTaxAuthorityDialog(): void {
        this.createTaxAuthorityDialogRef = this.dialog.open(CreateComponent,
            {
                width: 'var(--aside-pane-width)',
                position: {
                    top: '0',
                    right: '0'
                }
            }
        );
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof TaxAuthorityComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }

}
