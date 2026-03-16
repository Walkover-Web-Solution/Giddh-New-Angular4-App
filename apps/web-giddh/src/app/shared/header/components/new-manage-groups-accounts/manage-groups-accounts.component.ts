import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild, NgZone, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { Angular21ChangeDetectionService } from '../../../../services/angular21-change-detection.service';
import { AppState } from '../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { GeneralService } from "../../../../services/general.service";
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { AccountsAction } from 'apps/web-giddh/src/app/actions/accounts.actions';
import { MasterComponent } from '../master/master.component';
import { PageLeaveUtilityService } from 'apps/web-giddh/src/app/services/page-leave-utility.service';
import { IOption } from 'apps/web-giddh/src/app/app.constant';

@Component({
    selector: 'app-manage-groups-accounts',
    templateUrl: './manage-groups-accounts.component.html',
    styleUrls: ['./manage-groups-accounts.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})
export class ManageGroupsAccountsComponent implements OnInit, OnDestroy, AfterViewChecked {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Instance of master component */
    @ViewChild('master', { static: false }) public master: MasterComponent;
    @ViewChild('header', { static: true }) public header: ElementRef;
    @ViewChild('grpSrch', { static: true }) public groupSrch: ElementRef;
    /** Bounding rect of the header element, used to calculate scrollable body height */
    public showForm: boolean = false;
    @ViewChild('myModel', { static: true }) public myModel: ElementRef;
    public breadcrumbPath: string[] = [];
    public breadcrumbUniquePath: string[] = [];
    /** Computed body height = modal height - header height */
    public bodyHeight: number = 0;
    public searchLoad: Observable<boolean>;
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
    /** List of top shared groups */
    public topSharedGroups: any[] = [];
    /** List of data searched */
    public searchedMasterData: any[] = [];
    /** True if account has unsaved changes */
    private hasUnsavedChanges: boolean = false;
    /** True if confirmation is open on search groups/accounts keyup event */
    private isPageLeaveConfirmationOpen: boolean = false;
    /** Hold active group unique name */
    public activeGroupUniqueName: string = '';
    /** List of archived options */
    public archivedOptions: IOption[] = [];
    /** Selected archived option */
    public selectedArchivedOption: string;
    /** Selected archived label */
    public selectedArchivedLabel: string;
    /** True if archived dropdown is open */
    public archivedDropdownIsOpen: boolean = false;

    // tslint:disable-next-line:no-empty
    constructor(
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private cdRef: ChangeDetectorRef,
        private renderer: Renderer2,
        private generalService: GeneralService,
        private generalAction: GeneralActions,
        private groupService: GroupService,
        private accountsAction: AccountsAction,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private ngZone: NgZone,
        private changeDetectionService: Angular21ChangeDetectionService
    ) {
        this.searchLoad = this.store.pipe(select(state => state.groupwithaccounts.isGroupWithAccountsLoading), takeUntil(this.destroyed$));
        this.groupAndAccountSearchString$ = this.store.pipe(select(s => s.groupwithaccounts.groupAndAccountSearchString), takeUntil(this.destroyed$));
    }

    @HostListener('window:resize', ['$event'])
    public resizeEvent(e) {
        this.updateBodyHeight();
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
        this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
        this.getTopSharedGroups();
        // search groups
        this.groupSearchTerms.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe(term => {
                if (!this.initialLoad) {
                    this.store.dispatch(this.groupWithAccountsAction.hideAddNewForm());
                    this.store.dispatch(this.accountsAction.resetActiveAccount());
                    this.store.dispatch(this.groupWithAccountsAction.showEditAccountForm());
                    if (term) {
                        this.searchMasters(term);
                        this.breadcrumbPath = [];
                        this.breadcrumbUniquePath = [];
                    } else {
                        this.searchedMasterData = [];
                        this.breadcrumbPath = [];
                        this.breadcrumbUniquePath = [];
                    }
                } else {
                    if (term) {
                        this.searchMasters(term);
                        this.breadcrumbPath = [];
                        this.breadcrumbUniquePath = [];
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

        if (this.keyupInitialized) {
            setTimeout(() => {
                this.groupSrch?.nativeElement.focus();
            }, 200);
        }

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.hasUnsavedChanges && !response) {
                this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            }

            this.hasUnsavedChanges = response;
        });

        document.querySelector('body')?.classList?.add('master-page');
        this.updateBodyHeight();
    }

    public ngAfterViewChecked() {
        this.changeDetectionService.safeChangeDetection(this.cdRef, this.ngZone);
    }

    /**
     * Lifecycle hook called after view initialization
     *
     * @returns {void}
     * @memberof ManageGroupsAccountsComponent
     */
    public ngAfterViewInit(): void {
        this.updateBodyHeight();
    }

    /**
     * Updates bodyHeight based on current modal and header bounding rects 
     * 
     * @memberof ManageGroupsAccountsComponent
     * @returns {void}
     */
    private updateBodyHeight(): void {
        const modelRect = this.myModel?.nativeElement?.getBoundingClientRect();
        const headerRect = this.header?.nativeElement?.getBoundingClientRect();
        this.bodyHeight = (modelRect?.height ?? 0) - (headerRect?.height ?? 0);
        this.cdRef.detectChanges();
    }

    public searchGroups(term: string): void {
        if (this.hasUnsavedChanges) {
            if (!this.isPageLeaveConfirmationOpen) {
                this.confirmPageLeave(() => {
                    this.searchGroupsAndAccounts(term);
                });
            }
            return;
        }
        this.searchGroupsAndAccounts(term);
    }

    private searchGroupsAndAccounts(term: string): void {
        this.store.dispatch(this.groupWithAccountsAction.setGroupAndAccountsSearchString(term));
        this.groupSearchTerms.next(term);
        this.breadcrumbPath = [];
        this.breadcrumbUniquePath = [];
    }

    public resetGroupSearchString(needToFireRequest: boolean = true) {
        if (this.hasUnsavedChanges) {
            if (!this.isPageLeaveConfirmationOpen) {
                this.confirmPageLeave(() => {
                    this.resetSearchString(needToFireRequest);
                });
            }
            return;
        }
        this.resetSearchString(needToFireRequest);
    }

    private resetSearchString(needToFireRequest: boolean = true): void {
        if (needToFireRequest) {
            this.groupSearchTerms.next('');
            this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
        }

        this.master?.showTopLevelGroups();
        this.breadcrumbPath = [];
        this.breadcrumbUniquePath = [];
        this.renderer.setProperty(this.groupSrch?.nativeElement, 'value', '');
        this.searchString = "";
    }

    public closePopupEvent(): void {
        if (this.hasUnsavedChanges) {
            this.confirmPageLeave(() => {
                this.closePopup();
            });
            return;
        }
        this.closePopup();
    }

    /**
     * Closes master popup
     *
     * @private
     * @memberof ManageGroupsAccountsComponent
     */
    private closePopup(): void {
        document.querySelector('body')?.classList?.remove('master-page');
        this.store.dispatch(this.generalAction.addAndManageClosed());
        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
        this.closeEvent.emit(true);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.closePopup();
    }

    public scrollToRight(): void {
        let element = document.querySelector('#horizontal-master-scroll');
        if (element) {
            element.scrollLeft = element.scrollWidth;
        }
    }

    public breadcrumbPathChanged(obj) {
        this.breadcrumbUniquePath = obj.breadcrumbUniqueNamePath;
        this.breadcrumbPath = obj.breadcrumbPath;
    }

    /**
     * Get master data based on search
     *
     * @private
     * @param {*} term
     * @memberof ManageGroupsAccountsComponent
     */
    private searchMasters(term: any): void {
        this.searchedMasterData = [];
        this.breadcrumbPath = [];
        this.breadcrumbUniquePath = [];
        this.groupService.getGroupsWithAccounts(term, null, this.selectedArchivedOption).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                this.searchedMasterData = response?.body;
                this.changeDetectionService.triggerChangeDetection(this.cdRef, this.ngZone);
            } else {
                this.changeDetectionService.safeChangeDetection(this.cdRef, this.ngZone);
            }
        });
    }

    /**
     * Get top shared groups
     *
     * @private
     * @memberof ManageGroupsAccountsComponent
     */
    private getTopSharedGroups(): void {
        this.topSharedGroups = [];
        this.groupService.getTopSharedGroups().pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === "success") {
                this.topSharedGroups = response?.body?.results;
                this.changeDetectionService.triggerChangeDetection(this.cdRef, this.ngZone);
            } else {
                this.changeDetectionService.safeChangeDetection(this.cdRef, this.ngZone);
            }
        });
    }

    /**
     * Shows page leave confirmation
     *
     * @private
     * @param {Function} callback
     * @memberof ManageGroupsAccountsComponent
     */
    private confirmPageLeave(callback: Function): void {
        this.isPageLeaveConfirmationOpen = true;
        this.pageLeaveUtilityService.confirmPageLeave(action => {
            this.isPageLeaveConfirmationOpen = false;
            if (action) {
                this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                callback();
            }
        });
    }

    /**
     * Closes modal if escape is pressed
     *
     * @memberof ManageGroupsAccountsComponent
     */
    @HostListener("document:keyup.esc")
    public onPressEscape(): void {
        this.closePopupEvent();
    }

     /**
     * Handles selection of archived filter option
     *
     * @param {any} event Event containing selected filter value
     * @param {boolean} search Whether to perform search or not
     * @memberof ManageGroupsAccountsComponent
     */
     public onArchivedFilterSelected(event: any, search: boolean = true): void {
        this.selectedArchivedOption = event.value;
        this.selectedArchivedLabel = event.label;
        if (search) {
            this.searchGroups(this.searchString);
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof ManageGroupsAccountsComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.archivedOptions = this.generalService.getAccountArchivedOptions(this.commonLocaleData);
            this.onArchivedFilterSelected(this.archivedOptions[0], false);
            this.changeDetectionService.triggerChangeDetection(this.cdRef, this.ngZone);
        }
    }

    /**
     * Handles update of account
     *
     * @memberof ManageGroupsAccountsComponent
     */
    public handleUpdateAccount(): void {
        this.searchGroups(this.searchString);
    }
}
