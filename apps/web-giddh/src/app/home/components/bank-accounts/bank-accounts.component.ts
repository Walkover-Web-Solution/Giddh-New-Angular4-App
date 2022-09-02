import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../../store";
import { ContactService } from "../../../services/contact.service";
import { takeUntil } from "rxjs/operators";
import { createSelector } from "reselect";
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';

@Component({
    selector: 'bank-accounts',
    templateUrl: 'bank-accounts.component.html',
    styleUrls: ['./bank-accounts.component.scss', '../../home.component.scss']
})
export class BankAccountsComponent implements OnInit, OnDestroy {
    public universalDate$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public datePickerOptions: any;
    public dayjs = dayjs;
    public toDate: string;
    public fromDate: string;
    public bankAccounts: any[] = [];
    public activeCompany: any = {};
    /** This will hold local JSON data */
    public localeData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(private store: Store<AppState>, private contactService: ContactService) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.datePickerOptions = {
                    ...this.datePickerOptions, startDate: dayjs(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: dayjs(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: universalDate[2]
                };
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 20, '', 'closingBalance', 'desc');
            }
        })), takeUntil(this.destroyed$)).subscribe();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
        this.isLoading = true;
        pageNumber = pageNumber ? pageNumber : 1;
        refresh = refresh ? refresh : 'false';
        this.contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.status === 'success') {
                this.bankAccounts = res.body.results;
            }
            this.isLoading = false;
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
