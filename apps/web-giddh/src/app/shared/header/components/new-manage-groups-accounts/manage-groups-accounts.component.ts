import { debounceTime, takeUntil } from 'rxjs/operators';
import { GroupsAccountSidebarComponent } from '../new-group-account-sidebar/groups-account-sidebar.component';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { GroupAccountSidebarVM } from '../new-group-account-sidebar/VM';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.component';
import { GeneralService } from "../../../../services/general.service";
import { TabsModule } from 'ngx-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/ng-select';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';


@Component({
	selector: 'app-manage-groups-accounts',
	templateUrl: './manage-groups-accounts.component.html',
	styleUrls: ['./manage-groups-accounts.component.scss']
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
    public modalRef: BsModalRef;
	public groupList$: Observable<GroupsWithAccountsResponse[]>;
	public currentColumns: GroupAccountSidebarVM;
	public psConfig: PerfectScrollbarConfigInterface;
	public groupAndAccountSearchString$: Observable<string>;
	private groupSearchTerms = new Subject<string>();

	public searchString: any = '';

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** Add custom field form reference */
    public customFieldForm: FormGroup;

    /** List custom row data type  */
    public dataTypeList: IOption[] =
        [
            { label: "String", value: "STRING" },
            { label: "Number", value: "NUMERIC" },
            { label: "Boolean", value: "BOOLEAN" }
        ];
    /** List of custom row value type */
    public booleanDataTypeList: IOption[] =
        [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
        ];
    /** To check API call in progress */
    public isGetCustomInProgress: boolean = true;
    /** To check API call in progress */
    public isSaveCustomInProgress: boolean = false;
    /** To get any custom field in edit mode index */
    public isEnabledIndex: number = null;
    /** To get  custom fields length */
    public updateModeLength: number = 0;


	// tslint:disable-next-line:no-empty
	constructor(private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef,
        private renderer: Renderer2, private _generalService: GeneralService, private modalService: BsModalService, private groupService: GroupService, private toasterService: ToasterService) {
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

    /**
     * To open confirmation model
     *
     * @param {TemplateRef<any>} template
     * @memberof ManageGroupsAccountsComponent
     */
    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

	// tslint:disable-next-line:no-empty
	public ngOnInit() {

        this.customFieldForm = this.createCustomFieldForm();
        this.getCompanyCustomField();
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

    /**
     * To submit custom field data
     *
     * @param {*} value
     * @memberof ManageGroupsAccountsComponent
     */
    public submitCustomFields(value: any): void {
        this.isSaveCustomInProgress = true;
        this.groupService.createCompanyCustomField(value.customField).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.customFieldForm.get('customField').reset();
                    let customFieldResponse = response.body;
                    this.updateModeLength = customFieldResponse.length;
                    this.renderCustomField(customFieldResponse);
                } else {
                    this.toasterService.errorToast(response.message);
                }
                this.isEnabledIndex = null;
                this.isSaveCustomInProgress = false;

            }
        });
    }

    /**
     * API call to get custom field data
     *
     * @memberof ManageGroupsAccountsComponent
     */
    public getCompanyCustomField(): void {
        this.isGetCustomInProgress = true;
        this.groupService.getCompanyCustomField().subscribe(response => {
            this.isEnabledIndex = null;
            if (response && response.status === 'success') {
                this.renderCustomField(response.body);
                this.updateModeLength = response.body.length;
            } else {
                this.toasterService.errorToast(response.message);
            }
        this.isGetCustomInProgress = false;

        });
    }

    /**
     * To render custom field data
     *
     * @param {*} response
     * @memberof ManageGroupsAccountsComponent
     */
    public renderCustomField(response: any): void {
        let res: any[] = response;
        this.customFieldForm = this.createCustomFieldForm();
        const customRow = this.customFieldForm.get('customField') as FormArray;
        res.map(item => {
            item.isEditMode = true;
            customRow.push(this.initNewCustomField(item));
        });
        this.removeCustomFieldRow(0);
    }

    /**
     * To create and initialize custom field form
     *
     * @returns {FormGroup}
     * @memberof ManageGroupsAccountsComponent
     */
    public createCustomFieldForm(): FormGroup {
        return this.formBuilder.group({
            customField: this.formBuilder.array([
                this.initNewCustomField(null)
            ])
        });
    }

    /**
     * To initialize custom field form row
     *
     * @returns {FormGroup}
     * @memberof ManageGroupsAccountsComponent
     */
    public initNewCustomField(item: any): FormGroup {
        let initCustomForm = this.formBuilder.group({
            key: [null, Validators.compose([Validators.required])],
            dataType: [null, Validators.compose([Validators.required])],
            valueLength: [null, Validators.compose([Validators.required])],
            isEditMode: [false],
            uniqueName: [null],
        });
        if (item) {
            initCustomForm.patchValue(item);
        }
        return initCustomForm;
    }


    /**
    * To add new custom field row
    *
    * @returns {*}
    * @memberof ManageGroupsAccountsComponent
    */
    public addNewCustomFieldRow(): any {
        const customRow = this.customFieldForm.get('customField') as FormArray;
        if (this.customFieldForm.valid) {
            customRow.push(this.initNewCustomField(null));
        } else {
            this.toasterService.warningToast('please fill all mendatory field');
        }
        return;
    }

    /**
     * To remove custom field form row
     *
     * @param {number} index index number
     * @memberof ManageGroupsAccountsComponent
     */
    public removeCustomFieldRow(index: number): void {
        const row = this.customFieldForm.get('customField') as FormArray;
        if (row.length > 1) {
            row.removeAt(index);
        }
    }

    /**
     * To edit custom field row
     *
     * @param {number} index
     * @memberof ManageGroupsAccountsComponent
     */
    public editCustomfield(index: number): void {
        const row = this.customFieldForm.get('customField') as FormArray;
        this.isEnabledIndex = index;
        row.controls[index].get('isEditMode').setValue(false);
    }

    /**
     * To add remoive validation according to custom field type
     *
     * @param {*} event
     * @param {number} index
     * @memberof ManageGroupsAccountsComponent
     */
    public customFieldTypeSelected(event: any, index: number) {
        const row = this.customFieldForm.get('customField') as FormArray;
        if (event.value === 'BOOLEAN') {
            row.controls[index].get('valueLength').clearValidators();
        } else {
            row.controls[index].get('valueLength').setValidators([Validators.required])
        }
         row.controls[index].get('valueLength').setValue(null);
    }

}
