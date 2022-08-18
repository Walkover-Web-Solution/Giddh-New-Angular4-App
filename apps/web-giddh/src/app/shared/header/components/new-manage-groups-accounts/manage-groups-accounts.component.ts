import { debounceTime, takeUntil } from 'rxjs/operators';
import { GroupsAccountSidebarComponent } from '../new-group-account-sidebar/groups-account-sidebar.component';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { GroupAccountSidebarVM } from '../new-group-account-sidebar/VM';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { GeneralService } from "../../../../services/general.service";
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';

@Component({
    selector: 'app-manage-groups-accounts',
    templateUrl: './manage-groups-accounts.component.html',
    styleUrls: ['./manage-groups-accounts.component.scss']
})
export class ManageGroupsAccountsComponent implements OnInit, OnDestroy, AfterViewChecked {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('header', { static: true }) public header: ElementRef;
    @ViewChild('grpSrch', { static: true }) public groupSrch: ElementRef;
    public headerRect: any;
    public showForm: boolean = false;
    @ViewChild('myModel', { static: true }) public myModel: ElementRef;
    @ViewChild('groupsidebar', { static: true }) public groupsidebar: GroupsAccountSidebarComponent;
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    @ViewChild('perfectdirective', { static: true }) public directiveScroll: PerfectScrollbarComponent;
    public breadcrumbPath: string[] = [];
    public breadcrumbUniquePath: string[] = [];
    public myModelRect: any;
    public searchLoad: Observable<boolean>;
    public groupList$: Observable<GroupsWithAccountsResponse[]>;
    public currentColumns: GroupAccountSidebarVM;
    public psConfig: PerfectScrollbarConfigInterface;
    public groupAndAccountSearchString$: Observable<string>;
    private groupSearchTerms = new Subject<string>();
    public searchString: any = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold if keyup for focus in search field is initialized */
    public keyupInitialized: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if initial component load */
    public initialLoad: boolean = true;
    public searchedMasterData: any[] = [];

    // tslint:disable-next-line:no-empty
    constructor(
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private cdRef: ChangeDetectorRef,
        private renderer: Renderer2,
        private generalService: GeneralService,
        private generalAction: GeneralActions,
        private groupService: GroupService
    ) {
        this.searchLoad = this.store.pipe(select(state => state.groupwithaccounts.isGroupWithAccountsLoading), takeUntil(this.destroyed$));
        this.groupAndAccountSearchString$ = this.store.pipe(select(s => s.groupwithaccounts.groupAndAccountSearchString), takeUntil(this.destroyed$));
        this.psConfig = { maxScrollbarLength: 80 };
        this.store.dispatch(this.groupWithAccountsAction.initializeFirstLevelGroups());
        this.groupList$ = this.store.pipe(select(state => state.groupwithaccounts.firstLevelGroups), takeUntil(this.destroyed$));
    }

    @HostListener('window:resize', ['$event'])
    public resizeEvent(e) {
        this.headerRect = this.header.nativeElement?.getBoundingClientRect();
        this.myModelRect = this.myModel.nativeElement?.getBoundingClientRect();
    }

    /**
     * This will handle keyup event to put focus in search field on key up
     *
     * @param {*} event
     * @memberof ManageGroupsAccountsComponent
     */
    @HostListener('keyup', ['$event'])
    public onKeyUp(event: any): void {
        if (!this.keyupInitialized && this.generalService.allowCharactersNumbersSpecialCharacters(event)) {
            this.groupSrch?.nativeElement.focus();
            this.searchString = event.key;
            this.keyupInitialized = true;
        }
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {
        this.store.dispatch(this.generalAction.addAndManageClosed());
        // search groups
        this.groupSearchTerms.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe(term => {
                if (!this.initialLoad) {
                    if (term) {
                        this.searchMasters(term);
                    } else {
                        this.searchedMasterData = [];
                        this.store.dispatch(this.groupWithAccountsAction.resetFirstLevelGroups());
                        setTimeout(() => {
                            this.store.dispatch(this.groupWithAccountsAction.initializeFirstLevelGroups());
                        }, 10);
                    }
                }
                this.initialLoad = false;
            });

        this.groupAndAccountSearchString$.subscribe(s => {
            // set search string and pass next to groupSearchTerms subject
            this.searchString = s;
            this.groupSearchTerms.next(s);
            this.breadcrumbPath = [];
            this.breadcrumbUniquePath = [];
        });

        this.generalService.invokeEvent.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value[0] === "accountdeleted") {
                if (this.searchString) {
                    this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
                }
            }
        });

        this.groupList$.subscribe(response => {
            if (this.keyupInitialized) {
                setTimeout(() => {
                    this.groupSrch?.nativeElement.focus();
                }, 200);
            }
        });

        document.querySelector('body')?.classList?.add('master-page');
    }

    public ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    public searchGroups(term: string): void {
        this.store.dispatch(this.groupWithAccountsAction.setGroupAndAccountsSearchString(term));
        this.groupSearchTerms.next(term);
        this.breadcrumbPath = [];
        this.breadcrumbUniquePath = [];
    }

    public resetGroupSearchString(needToFireRequest: boolean = true) {
        if (needToFireRequest) {
            this.groupSearchTerms.next('');
            this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
        }

        this.breadcrumbPath = [];
        this.breadcrumbUniquePath = [];
        this.renderer.setProperty(this.groupSrch?.nativeElement, 'value', '');
    }

    public closePopupEvent() {
        this.store.dispatch(this.generalAction.addAndManageClosed());
        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
        this.closeEvent.emit(true);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('master-page');
    }

    public ScrollToRight() {
        if (this.directiveScroll) {
            this.directiveScroll.directiveRef.scrollToRight();
        }
    }

    public breadcrumbPathChanged(obj) {
        this.breadcrumbUniquePath = obj.breadcrumbUniqueNamePath;
        this.breadcrumbPath = obj.breadcrumbPath;
    }

    private searchMasters(term: any): void {
        this.searchedMasterData = [];
        this.groupService.GetGroupsWithAccounts(term).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                this.searchedMasterData = response?.body;
            }
        });
    }
}
