import { Component, OnInit, ChangeDetectorRef, HostListener, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommandKRequest } from '../models/api-models/Common';
import { Subject, ReplaySubject, of as observableOf } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { CommandKService } from '../services/commandk.service';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { remove } from '../lodash-optimized';
import { Router } from '@angular/router';
import { BACKSPACE } from '@angular/cdk/keycodes';

@Component({
    selector: 'mobile-home',
    templateUrl: './mobile-home.component.html',
    styleUrls: ['./mobile-home.component.scss']

})

export class MobileHomeComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('searchEle') public searchEle: ElementRef;

    public allowLoadMore: boolean = false;
    public isLoading: boolean = false;
    public activeCompanyUniqueName: any = '';
    public commandKRequestParams: CommandKRequest = {
        page: 1,
        q: '',
        group: '',
        totalPages: 1
    };
    public visibleItems: number = 10;
    public searchedItems: any[] = [];
    public listOfSelectedGroups: any[] = [];
    public noResultsFound: boolean = false;
    public hasMenus: boolean = false;
    public hasAccounts: boolean = false;
    public hasGroups: boolean = false;
    public companyInitials: any = '';
    public searchString: any = "";
    private searchSubject: Subject<string> = new Subject();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private generalService: GeneralService, private commandKService: CommandKService, private cdref: ChangeDetectorRef, private router: Router) {
        document.querySelector('body').classList.add('mobile-home');

        this.store.pipe(select(p => p.session.companyUniqueName), takeUntil(this.destroyed$)).subscribe(res => {
            this.activeCompanyUniqueName = res;
        });
    }

    /**
     * Initializes the component
     *
     * @memberof MobileHomeComponent
     */
    public ngOnInit(): void {
        // listen on input for search
        this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
            this.commandKRequestParams.page = 1;
            this.commandKRequestParams.q = term;
            this.searchCommandK(true);
            this.cdref.markForCheck();
        });

        this.searchSubject.next("");

        this.store.pipe(select((state: AppState) => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
            if (companies) {
                let selectedCmp = companies.find(cmp => {
                    if (cmp && cmp.uniqueName) {
                        return cmp.uniqueName === this.generalService.companyUniqueName;
                    } else {
                        return false;
                    }
                });

                if (selectedCmp) {
                    let selectedCompanyArray = selectedCmp.name.split(" ");
                    let companyInitials = [];
                    for (let loop = 0; loop < selectedCompanyArray.length; loop++) {
                        if (loop <= 1) {
                            companyInitials.push(selectedCompanyArray[loop][0]);
                        } else {
                            break;
                        }
                    }

                    this.companyInitials = companyInitials.join(" ");
                }
            }
        });
    }

    /**
     * This function gets called after view initializes and will set focus in search box
     * 
     * @memberof MobileHomeComponent
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInSearchBox();
        }, 0);
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof MobileHomeComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('mobile-home');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will call the command k api
     *
     * @param {boolean} resetItems
     * @returns {(void | boolean)}
     * @memberof MobileHomeComponent
     */
    public searchCommandK(resetItems: boolean): void | boolean {
        if (this.isLoading) {
            return false;
        }

        if (resetItems) {
            this.searchedItems = [];
        }

        this.isLoading = true;

        if (this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            let lastGroup = this.generalService.getLastElement(this.listOfSelectedGroups);
            this.commandKRequestParams.group = lastGroup.uniqueName;
        } else {
            this.commandKRequestParams.group = "";
        }

        this.hasMenus = false;
        this.hasGroups = false;
        this.hasAccounts = false;

        this.commandKService.searchCommandK(this.commandKRequestParams, this.activeCompanyUniqueName).subscribe((res) => {
            this.isLoading = false;

            if (res && res.body && res.body.results && res.body.results.length > 0) {
                let length = (this.searchedItems) ? this.searchedItems.length : 0;
                res.body.results.forEach((key, index) => {
                    key.loop = length + index;
                    this.searchedItems.push(key);

                    if (key.type === "MENU") {
                        this.hasMenus = true;
                    } else if (key.type === "GROUP") {
                        this.hasGroups = true;
                    } else if (key.type === "ACCOUNT") {
                        this.hasAccounts = true;
                    }
                });
                this.noResultsFound = false;
                this.allowLoadMore = true;
                this.commandKRequestParams.totalPages = res.body.totalPages;
                this.cdref.detectChanges();
            } else {
                if (this.searchedItems.length === 0) {
                    this.noResultsFound = true;
                    this.allowLoadMore = false;
                }
                this.cdref.detectChanges();
            }
        });
    }

    /**
     * This function will remove the selected groups in decending order
     * if we press backspace in search box
     * @param {*} [item]
     * @memberof MobileHomeComponent
     */
    public removeItemFromSelectedGroups(item?: any): void {
        if (item) {
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
    }

    /**
     * This function puts the focus in search box
     *
     * @param {KeyboardEvent} [e]
     * @memberof MobileHomeComponent
     */
    public focusInSearchBox(e?: KeyboardEvent): void {
        if (this.searchEle) {
            this.searchEle.nativeElement.focus();
        }
    }

    /**
     * This function returns the uniquename of item
     *
     * @param {*} index
     * @param {*} item
     * @returns uniqueName
     * @memberof MobileHomeComponent
     */
    public trackByFn(index, item: any) {
        return item.uniqueName; // unique id corresponding to the item
    }

    /**
     * This function will load more records on scroll
     *
     * @param {*} event
     * @memberof MobileHomeComponent
     */
    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
        // visible height + pixel scrolled >= total height - 200 (deducted 200 to load list little earlier before user reaches to end)
        if (event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight - 200)) {
            if (this.allowLoadMore && !this.isLoading) {
                if (this.commandKRequestParams.page + 1 <= this.commandKRequestParams.totalPages) {
                    this.commandKRequestParams.page++;
                    this.searchCommandK(false);
                }
            }
        }
    }

    /**
     * This function will init search on keyup of search box
     *
     * @param {KeyboardEvent} e
     * @param {string} term
     * @returns {void}
     * @memberof MobileHomeComponent
     */
    public initSearch(e: KeyboardEvent, term: string): void {
        term = term.trim();
        this.searchSubject.next(term);
    }

    /**
     * This function will get called if any item get selected
     *
     * @param {*} item
     * @memberof MobileHomeComponent
     */
    public itemSelected(item: any): void {
        if (item && item.type === 'MENU') {
            item.uniqueName = item.route;

            if (item.additional && item.additional.tab) {
                if (item.uniqueName.includes('?')) {
                    item.uniqueName = item.uniqueName.split('?')[0];
                }
                this.router.navigate([item.uniqueName], {
                    queryParams: {
                        tab: item.additional.tab,
                        tabIndex: item.additional.tabIndex
                    }
                });
            } else {
                this.router.navigate([item.uniqueName]);
            }
        } else if (item.type === 'GROUP') {
            this.commandKRequestParams.q = "";
            if(!this.listOfSelectedGroups || this.listOfSelectedGroups.length === 0) {
                this.listOfSelectedGroups = [];
            }
            this.listOfSelectedGroups.push(item);
            this.searchString = "";
            this.searchEle.nativeElement.value = null;

            this.focusInSearchBox();
            this.searchCommandK(true);
        } else {
            let url = `ledger/${item.uniqueName}`;
            this.router.navigate([url]);
        }
    }

    /**
     * This will clear the search string
     *
     * @memberof MobileHomeComponent
     */
    public clearSearch(): void {
        this.searchString = "";
        this.searchEle.nativeElement.value = null;
        this.searchSubject.next("");
        this.listOfSelectedGroups = [];
    }

    /**
     * This function will get called if we remove search string or group
     *
     * @param {*} e
     * @memberof MobileHomeComponent
     */
    public handleKeydown(e: any): void {
        let key = e.which || e.keyCode;

        if (key === BACKSPACE && !this.searchEle.nativeElement.value && this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            this.removeItemFromSelectedGroups();
        }
    }
}