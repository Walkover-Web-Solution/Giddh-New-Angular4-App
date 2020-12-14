import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { SettingsProfileService } from '../../../services/settings.profile.service';

@Component({
    selector: 'company-details-sidebar',
    styleUrls: ['./company-details-sidebar.component.scss'],
    templateUrl: './company-details-sidebar.component.html'
})

export class CompanyDetailsSidebarComponent implements OnInit {
    @Input() public selectedCompany: any;
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    public moment = moment;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    constructor(private settingsProfileService: SettingsProfileService) {

    }

    public ngOnInit() {
        if(this.selectedCompany) {
            this.getCompanyDetails();
        }
    }

    /**
     * This will get the company details
     *
     * @memberof CompanyDetailsSidebarComponent
     */
    public getCompanyDetails(): void {
        this.settingsProfileService.getCompanyDetails(this.selectedCompany.uniqueName).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.selectedCompany = response.body;
            }
        });
    }
}
