import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';

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

    constructor() {

    }

    public ngOnInit() {

    }
}
