import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SettingsFinancialYearService } from '../../../services/settings.financial-year.service';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { IFlattenGroupsAccountsDetail } from '../../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/ng-select';

@Component({
    selector: 'columnar-report-component',
    templateUrl: './columnar.report.component.html',
    styleUrls: ['./columnar.report.component.scss']
})

export class ColumnarReportComponent implements OnInit {
    public selectedType = 'monthly';
    public monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    public selectYear: any = [];

    selectMonth = [{ label: 'Select All', value: 'Select All' },
    { label: 'Decemeber', value: 'Decemeber' },
    { label: 'Novmber', value: 'Novmber' }];

    public showOpeningClosingBalance = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
    public selectCrDr = [{ label: 'Yes', value: true }, { label: 'No', value: false }];

    public flatGroupsOptions: any = [];
    private flattenGroups$: Observable<IFlattenGroupsAccountsDetail[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router, public settingsFinancialYearService: SettingsFinancialYearService, private store: Store<AppState>) {
        this.flattenGroups$ = this.store.pipe(select(state => state.general.flattenGroups), takeUntil(this.destroyed$));

        this.flattenGroups$.subscribe(flattenGroups => {
            if (flattenGroups) {
                flattenGroups.forEach(key => {
                    if (!key.parentGroups || key.parentGroups.length === 0) {
                        this.flatGroupsOptions.push({ label: key.groupName, value: key.groupUniqueName });
                    }
                });
            }
        });
    }

    ngOnInit() {
        this.getFinancialYears();
    }

    public goToDashboard() {
        this.router.navigate(['/pages/reports']);
    }

    public getFinancialYears() {
        this.settingsFinancialYearService.GetAllFinancialYears().subscribe(res => {
            if (res && res.body && res.body.financialYears) {
                res.body.financialYears.forEach(key => {
                    this.selectYear.push({ label: key.uniqueName, value: key.uniqueName });
                });
            }
        });
    }
}