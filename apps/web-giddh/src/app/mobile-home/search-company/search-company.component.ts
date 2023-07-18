import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CompanyResponse } from '../../models/api-models/Company';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { cloneDeep } from '../../lodash-optimized';
import { LoginActions } from '../../actions/login.action';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'mobile-seach-company',
    templateUrl: './search-company.component.html',
    styleUrls: ['./search-company.component.scss'],
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
    /* This will hold local JSON data */
    public localeData: any = {};

    constructor(
        private store: Store<AppState>,
        private loginAction: LoginActions,
        private router: Router,
        private breakPointObservar: BreakpointObserver) {

    }

    /**
     * Initializes the component
     *
     * @memberof MobileSearchCompanyComponent
     */
    public ngOnInit(): void {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (!result.matches) {
                this.router.navigate(["/pages/home"]);
            }
        });

        document.querySelector('body').classList.add('remove-header-lower-layer');

        this.store.pipe(select((state: AppState) => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
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
    public ngOnDestroy(): void {
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
    public filterCompanyList(ev: string): void {
        let companies: CompanyResponse[] = cloneDeep(this.allCompanies)?.filter(company => ((company && company.name && company.name?.toLowerCase().includes(ev?.toLowerCase())) || (company.alias && company.alias?.toLowerCase().includes(ev?.toLowerCase()))));
        this.companyList = cloneDeep(companies);
    }

    /**
     * This will change company
     *
     * @param {string} selectedCompanyUniqueName
     *
     * @memberof MobileSearchCompanyComponent
     */
    public changeCompany(selectedCompanyUniqueName: string): void {
        this.store.dispatch(this.loginAction.ChangeCompany(selectedCompanyUniqueName));
    }

    /**
     * This is to put focus in search box
     *
     * @param {KeyboardEvent} [e]
     * @memberof MobileSearchCompanyComponent
     */
    public focusInSearchBox(event?: KeyboardEvent): void {
        if (this.searchElement) {
            this.searchElement.nativeElement.focus();
        }
    }
}
