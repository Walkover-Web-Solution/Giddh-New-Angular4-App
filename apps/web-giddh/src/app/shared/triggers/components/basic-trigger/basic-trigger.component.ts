import { Component, OnInit } from "@angular/core";
import { Observable, take } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { NewConfirmationModalComponent } from "apps/web-giddh/src/app/theme/new-confirmation-modal/confirmation-modal.component";
import { ASIDE_PANE_CONFIG, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { ITriggerList } from "../../uitilty/trigger.const";
import { GeneralService } from "apps/web-giddh/src/app/services/general.service";
import { TriggerComponentStore } from "../../uitilty/trigger.store";
import { TemplateFroalaComponent } from "../../../template-froala/template-froala.component";

@Component({
    selector: 'app-basic-trigger',
    templateUrl: './basic-trigger.component.html',
    styleUrls: ['./basic-trigger.component.scss'],
    providers: [TriggerComponentStore]
})

export class BasicTriggerComponent implements OnInit {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds page size options */
    public pageSizeOptions: any[] = PAGE_SIZE_OPTIONS;
    /** Holds Obligations table data */
    public dataSource: ITriggerList[] = [];
    /** Holds Obligations table columns */
    public displayedColumns: string[] = [
        'title',
        'entity',
        'emailSubject',
        'triggerModule',
        'executionTime',
        'conditions',
        'actions',
        'disabled',
        'other_action'
    ];
    /** Holds trigger list data */
    public triggerList$: Observable<any> = this.componentStore.triggerList$;
    /** True if API Call is in progress */
    public isLoading$: Observable<boolean> = this.componentStore.isLoading$;
    /** Holds the request parameters from the URL */
    public triggerListRequest: any = {
        page: 1,
        count: PAGINATION_LIMIT
    };

    constructor(
        private generalService: GeneralService,
        private componentStore: TriggerComponentStore,
        private dialog: MatDialog
    ) { }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof BasicTriggerComponent
    */
    public ngOnInit(): void {
        this.getTriggerList();
    }

    /**
     * Get trigger list
     *
     * @memberof BasicTriggerComponent
     */
    private getTriggerList(): void {
        this.componentStore.getTriggerList(this.triggerListRequest);
    }

    /**
     * Handle page change
     *
     * @param {*} event
     * @memberof BasicTriggerComponent
     */
    public handlePageChange(event: any): void {
        this.triggerListRequest.count = event.pageSize;
        this.triggerListRequest.page = event.pageIndex + 1;
        this.getTriggerList();
    }

    /**
     * Delete trigger
     *
     * @param {any} element
     * @memberof BasicTriggerComponent
     */
    public deleteTrigger(element: any): void {
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            data: {
                configuration: this.generalService.deleteConfiguration(
                    this.localeData?.delete_trigger_message?.replace("[NAME]", element.title),
                    this.commonLocaleData
                )
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.componentStore.deleteTrigger(element.uniqueName);
            }
        });
    }

    /**
     * Open create edit trigger dialog
     *
     * @param {any} triggerUniqueName
     * @memberof BasicTriggerComponent
     */
    public openCreateEditTriggerDialog(triggerUniqueName?: any): void {
        const dialogConfig = ASIDE_PANE_CONFIG;
        dialogConfig.data = { isTrigger: true, ...(triggerUniqueName ? { triggerUniqueName } : {}) };
        const dialogRef = this.dialog.open(TemplateFroalaComponent, dialogConfig);
        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.getTriggerList();
            }
        });
    }
}
