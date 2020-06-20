import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CompanyResponse } from '../../models/api-models/Company';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { cloneDeep } from '../../lodash-optimized';
import { LoginActions } from '../../actions/login.action';
@Component({
    selector: 'mobile-seach-company',
    templateUrl: './mobile-search-company.component.html',
    styleUrls: ['./mobile-search-company.component.scss']
})
export class MobileSearchCompanyComponent implements OnInit, OnDestroy {

    /* Search element for focus */
    public searchElement: ElementRef;
    /* Search company, input value */
    public searchCmp: string = '';
    /* Filtered Company List */
    public companyList: CompanyResponse[] = [];
    /* All companies */
    public allCompanies: CompanyResponse[] = [];
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public focusInSearchBox(e?: KeyboardEvent): void {
        if (this.searchElement) {
            this.searchElement.nativeElement.focus();
        }
    }

    constructor(
        private _store: Store<AppState>,
        private _loginAction: LoginActions
    ) { }

    public ngOnInit() {
        document.querySelector('body').classList.add('remove-header-lower-layer');

        this._store.pipe(
            select((state: AppState) => state.session.companies),
            takeUntil(this.destroyed$)
        ).subscribe(companies => {
            if (!companies || (companies.length === 0)) {
                return;
            }
            let orderedCompanies = _.orderBy(companies, 'name');
            this.allCompanies = cloneDeep(orderedCompanies);
            this.companyList = orderedCompanies;
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof MobileSearchCompanyComponent
     */
    public ngOnDestroy() {
        document.querySelector('body').classList.remove('remove-header-lower-layer');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will filter company by name or name alias
     *
     * @param {string} ev
     * 
     * @memberof MobileSearchCompanyComponent
     */
    public filterCompanyList(ev: string) {
        let companies: CompanyResponse[] = cloneDeep(this.allCompanies).filter(cmp => (cmp.name.toLowerCase().includes(ev.toLowerCase()) || cmp.nameAlias.toLowerCase().includes(ev.toLowerCase())));
        this.companyList = cloneDeep(companies);
    }

    /**
     * This will change company
     *
     * @param {string} selectedCompanyUniqueName
     *
     * @memberof MobileSearchCompanyComponent
     */
    public changeCompany(selectedCompanyUniqueName: string) {
        this._store.dispatch(this._loginAction.ChangeCompany(selectedCompanyUniqueName));
    }
}
