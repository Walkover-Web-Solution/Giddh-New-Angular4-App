import { debounceTime, takeUntil } from 'rxjs/operators';
import { GroupsAccountSidebarComponent } from '../new-group-account-sidebar/groups-account-sidebar.component';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { GroupAccountSidebarVM } from '../new-group-account-sidebar/VM';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.component';
import { GeneralService } from "../../../../services/general.service";

@Component({
	selector: 'app-manage-groups-accounts',
	templateUrl: './manage-groups-accounts.component.html',
	styleUrls: ['./manage-groups-accounts.component.css']
})
export class ManageGroupsAccountsComponent implements OnInit, OnDestroy, AfterViewChecked {
	@Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
	@ViewChild('header') public header: ElementRef;
	@ViewChild('grpSrch') public groupSrch: ElementRef;
	public headerRect: any;
	public showForm: boolean = false;
	@ViewChild('myModel') public myModel: ElementRef;
	@ViewChild('groupsidebar') public groupsidebar: GroupsAccountSidebarComponent;
	public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
	@ViewChild('perfectdirective') public directiveScroll: PerfectScrollbarComponent;

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

	// tslint:disable-next-line:no-empty
	constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private cdRef: ChangeDetectorRef,
		private renderer: Renderer2, private _generalService: GeneralService) {
		this.searchLoad = this.store.select(state => state.groupwithaccounts.isGroupWithAccountsLoading).pipe(takeUntil(this.destroyed$));
		this.groupList$ = this.store.select(state => state.groupwithaccounts.groupswithaccounts).pipe(takeUntil(this.destroyed$));
		this.groupAndAccountSearchString$ = this.store.select(s => s.groupwithaccounts.groupAndAccountSearchString).pipe(takeUntil(this.destroyed$));
		this.psConfig = { maxScrollbarLength: 80 };
	}

	@HostListener('window:resize', ['$event'])
	public resizeEvent(e) {
		this.headerRect = this.header.nativeElement.getBoundingClientRect();
		this.myModelRect = this.myModel.nativeElement.getBoundingClientRect();
	}

	// tslint:disable-next-line:no-empty
	public ngOnInit() {
		// search groups
		this.groupSearchTerms.pipe(
			debounceTime(700))
			.subscribe(term => {
				this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(term));
			});

		this.groupAndAccountSearchString$.subscribe(s => {
			// set search string and pass next to groupSearchTerms subject
			this.searchString = s;
			this.groupSearchTerms.next(s);
			this.breadcrumbPath = [];
			this.breadcrumbUniquePath = [];
		});

		this._generalService.invokeEvent.subscribe(value => {
			if (value[0] === "accountdeleted") {
				if (this.searchString) {
					this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
					this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(this.searchString));
				}
			}
		});
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
		// this.store.dispatch(this.groupWithAccountsAction.resetGroupAndAccountsSearchString());
		if (needToFireRequest) {
			this.groupSearchTerms.next('');
			this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
		}

		this.breadcrumbPath = [];
		this.breadcrumbUniquePath = [];
		this.renderer.setProperty(this.groupSrch.nativeElement, 'value', '');
		// this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
	}

	public closePopupEvent() {
		this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
		this.closeEvent.emit(true);
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public ScrollToRight() {
		if (this.directiveScroll) {
			this.directiveScroll.directiveRef.scrollToRight();
		}
	}

	public breadcrumbPathChanged(obj) {
		// breadcrumbUniquePath
		this.breadcrumbUniquePath = obj.breadcrumbUniqueNamePath;
		this.breadcrumbPath = obj.breadcrumbPath;
	}
}
