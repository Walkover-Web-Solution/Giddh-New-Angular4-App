import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { ReplaySubject, combineLatest, takeUntil } from 'rxjs';
import { SettingsProfileService } from '../services/settings.profile.service';
import { ToasterService } from '../services/toaster.service';
export interface GetDomainList {
    type: any;
    hostName: any;
    value: any;
    status: any;
    isCopiedHostName: boolean;
    isCopiedValue: boolean;
}
/** Hold information of activity logs */
const ELEMENT_DATA: GetDomainList[] = [];
@Component({
    selector: 'dns-records',
    templateUrl: './dns-records.component.html',
    styleUrls: ['./dns-records.component.scss']
})
export class DnsRecordsComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* it will store image path */
    public imgPath: string = '';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if API is in progress */
    public shouldShowLoader: boolean = false;
    /** This will hold domain unique name */
    public domain: any = {
        uniqueName: '',
        name: '',
    };
    /** Hold the data of activity logs */
    public dataSource = ELEMENT_DATA;
    /** This will use for table heading */
    public displayedColumns: string[] = ['type', 'hostName', 'value', 'status'];
    /* it will store company uniquename */
    public companyUniqueName: string = '';


    constructor(private route: ActivatedRoute,
        private settingsProfileService: SettingsProfileService,
        private toaster: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        private clipboardService: ClipboardService) {
    }


    /**
   * Initializes the component
   *
   * @memberof DnsRecordsComponent
   */
    public ngOnInit(): void {

        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        combineLatest([
            this.route.queryParams.pipe(takeUntil(this.destroyed$)),
            this.route.params.pipe(takeUntil(this.destroyed$))
        ]).subscribe(([queryParams, params]) => {
            this.domain.uniqueName = queryParams.domainUniqueName;
            this.companyUniqueName = params.companyUniqueName;
            this.getDomainListData(this.domain.uniqueName);
        });
    }

    /**
     * This will be use for get domain information
     *
     * @param {string} uniqueName
     * @memberof DnsRecordsComponent
     */
    public getDomainListData(uniqueName: string): void {
        this.shouldShowLoader = true;
        this.settingsProfileService.getDomainListTableData(uniqueName, this.companyUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.shouldShowLoader = false;
                this.domain.name = response.body[0]?.domainName
                if (response?.body?.length) {
                    this.dataSource = response.body?.map(portal => {
                        return { type: 'CNAME', hostName: portal.domainName, value: 'portal.giddh.com', status: portal.verified, isCopiedHostName: false, isCopiedValue: false };
                    });
                }
            } else {
                this.toaster.showSnackBar("error", response.message);
                this.shouldShowLoader = false;
            }
        });
        this.changeDetectorRef.detectChanges();
    }


    /**
    *This will use for copy api url link and display copied
    *
    * @memberof DnsRecordsComponent
    */
    public copyUrl(value: any, host: any, type: any): void {
        const urlToCopy = value;
        this.clipboardService.copyFromContent(urlToCopy);
        if (type === 'host') {
            host.isCopiedHostName = true;
        } else {
            host.isCopiedValue = true;
        }
        setTimeout(() => {
            host.isCopiedHostName = false;
            host.isCopiedValue = false;
        }, 3000);
    }

    /**
     * Unsubscribes from listeners
     *
     * @memberof DnsRecordsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
