import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { ReplaySubject } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';

@Component({
    selector: 'tally-integration',
    templateUrl: './tally.intergation.component.html',
    styleUrls: ['./tally.intergation.component.scss'],
    standalone: false,
})
export class TallyIntegrationComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold apiUrl */
    public apiUrl: string = '';
    /** This will hold isCopied */
    public isCopied: boolean = false;
    /** Holds help documentation url for syncing with Tally */
    public syncWithTallyHelpDocUrl: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private generalService: GeneralService, private clipboardService: ClipboardService, @Inject(ServiceConfig) private serviceConfig: IServiceConfigArgs) {
    }

    /**
     * This hook will use for init
     *
     * @memberof TallyIntegrationComponent
     */
    public ngOnInit(): void {
        let companyUniqueName = this.generalService.companyUniqueName;
        this.apiUrl = `${ApiUrl}company/${companyUniqueName}/imports/tally-import`;
        this.syncWithTallyHelpDocUrl = this.serviceConfig.SYNC_TALLY_HELP_DOC_URL;
    }

    /**
     *This will use for copy api url link and display copied
    *
    * @memberof TallyIntegrationComponent
    */
    public copyUrl(): void {
        const urlToCopy = this.apiUrl;
        this.clipboardService.copyFromContent(urlToCopy);
        this.isCopied = true;
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }

    /**
     * Releases memory
     *
     * @memberof TallyIntegrationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
