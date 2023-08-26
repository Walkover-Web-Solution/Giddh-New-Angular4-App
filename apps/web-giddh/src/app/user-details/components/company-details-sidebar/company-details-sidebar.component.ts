import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'company-details-sidebar',
    styleUrls: ['./company-details-sidebar.component.scss'],
    templateUrl: './company-details-sidebar.component.html'
})

export class CompanyDetailsSidebarComponent implements OnInit {
    @Input() public selectedCompany: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    public dayjs = dayjs;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private settingsProfileService: SettingsProfileService) {

    }

    public ngOnInit() {
        if (this.selectedCompany) {
            this.getCompanyDetails();
        }
    }

    /**
     * This will get the company details
     *
     * @memberof CompanyDetailsSidebarComponent
     */
    public getCompanyDetails(): void {
        this.settingsProfileService.getCompanyDetails(this.selectedCompany?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.selectedCompany = response.body;
            }
        });
    }

    /**
     * Releases memory
     *
     * @memberof CompanyDetailsSidebarComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
