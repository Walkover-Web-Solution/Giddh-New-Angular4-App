import { debounceTime, takeUntil } from 'rxjs/operators';
import { GroupsAccountSidebarComponent } from '../new-group-account-sidebar/groups-account-sidebar.component';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { GroupsWithAccountsResponse } from '../../../../models/api-models/GroupsWithAccounts';
import { AppState } from '../../../../store/roots';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { GroupAccountSidebarVM } from '../new-group-account-sidebar/VM';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { GeneralService } from "../../../../services/general.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/ng-select';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'apps/web-giddh/src/app/services/group.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';

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
    /** model reference */
    public modalRef: BsModalRef;
    public groupList$: Observable<GroupsWithAccountsResponse[]>;
    public currentColumns: GroupAccountSidebarVM;
    public psConfig: PerfectScrollbarConfigInterface;
    public groupAndAccountSearchString$: Observable<string>;
    private groupSearchTerms = new Subject<string>();
    public searchString: any = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold if keyup for focus in search field is initialized */
    public keyupInitialized: boolean = false;
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /** Add custom field form reference */
    public customFieldForm: FormGroup;
    /** List custom row data type  */
    public dataTypeList: IOption[] = [];
    /** To check API call in progress */
    public isGetCustomInProgress: boolean = true;
    /** To check API call in progress */
    public isSaveCustomInProgress: boolean = false;
    /** To get any custom field in edit mode index */
    public isEnabledIndex: number = null;
    /** To get  custom fields length */
    public updateModeLength: number = 0;
    /** Index to delete row in custom field */
    public selectedRowIndex: number = null;
    /* To check form value validation */
    public isCustomFormValid: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if initial component load */
    public initialLoad: boolean = true;

    // tslint:disable-next-line:no-empty
    constructor(
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private formBuilder: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private breakPointObservar: BreakpointObserver,
        private renderer: Renderer2,
        private _generalService: GeneralService,
        private modalService: BsModalService,
        private groupService: GroupService,
        private toasterService: ToasterService
    ) {
        this.searchLoad = this.store.pipe(select(state => state.groupwithaccounts.isGroupWithAccountsLoading), takeUntil(this.destroyed$));
        this.groupAndAccountSearchString$ = this.store.pipe(select(s => s.groupwithaccounts.groupAndAccountSearchString), takeUntil(this.destroyed$));
        this.psConfig = { maxScrollbarLength: 80 };
        this.groupList$ = this.store.pipe(select(state => state.groupwithaccounts.groupswithaccounts), takeUntil(this.destroyed$));
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
        if (!this.keyupInitialized && this._generalService.allowCharactersNumbersSpecialCharacters(event)) {
            this.groupSrch?.nativeElement.focus();
            this.searchString = event.key;
            this.keyupInitialized = true;
        }
    }

    /**
     * To open confirmation model
     *
     * @param {TemplateRef<any>} template
     * @memberof ManageGroupsAccountsComponent
     */
    public openModal(template: TemplateRef<any>, index: number): void {
        this.modalRef = this.modalService.show(template);
        this.selectedRowIndex = index;
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
        this.customFieldForm = this.createCustomFieldForm();
        this.getCompanyCustomField();
        // search groups
        this.groupSearchTerms.pipe(
            debounceTime(700), takeUntil(this.destroyed$))
            .subscribe(term => {
                if(!this.initialLoad) {
                    this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(term));
                } else {
                    this.searchLoad.subscribe(response => {
                        if(!response && this.initialLoad) {
                            this.initialLoad = false;
                            this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(term));
                        }
                    });
                }
            });

        this.groupAndAccountSearchString$.subscribe(s => {
            // set search string and pass next to groupSearchTerms subject
            this.searchString = s;
            this.groupSearchTerms.next(s);
            this.breadcrumbPath = [];
            this.breadcrumbUniquePath = [];
        });

        this._generalService.invokeEvent.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value[0] === "accountdeleted") {
                if (this.searchString) {
                    this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
                    this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(this.searchString));
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
        this.breadcrumbUniquePath = obj.breadcrumbUniqueNamePath;
        this.breadcrumbPath = obj.breadcrumbPath;
    }

    /**
     * To submit custom field data
     *
     * @param {string} operationType To check operation type
     * @param {*} type API call operation type
     * @param {*} value
     * @memberof ManageGroupsAccountsComponent
     */
    public submitCustomFields(value: any, operationType?: string): void {
        this.isSaveCustomInProgress = true;
        this.groupService.createCompanyCustomField(value.customField).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.customFieldForm.get('customField').reset();
                    let customFieldResponse = response.body;
                    this.updateModeLength = customFieldResponse?.length;
                    this.renderCustomField(customFieldResponse);
                    if (operationType === 'create') {
                        this.toasterService.successToast(this.localeData?.custom_field_created);
                    } else if (operationType === 'delete') {
                        this.toasterService.successToast(this.localeData?.custom_field_deleted);
                    } else {
                        this.toasterService.successToast(this.localeData?.custom_field_updated);
                    }
                } else {
                    this.toasterService.errorToast(response.message);
                    this.getCompanyCustomField();
                }
                this.isEnabledIndex = null;
                this.isSaveCustomInProgress = false;
                if (this.modalRef) {
                    this.modalRef.hide()
                }
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
        this.groupService.getCompanyCustomField().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isEnabledIndex = null;
            if (response) {
                if (response.status === 'success') {
                    this.renderCustomField(response.body);
                    this.updateModeLength = response.body?.length;
                } else if (response.message) {
                    this.toasterService.errorToast(response.message);
                }
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
        if (res?.length) {
            res.map(item => {
                item.isEditMode = true;
                customRow.push(this.initNewCustomField(item));
            });
            this.removeCustomFieldRow(0, false);
        }
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
            initCustomForm?.patchValue(item);
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
            this.toasterService.warningToast(this.localeData?.fill_mandatory_fields);
        }
        return;
    }

    /**
     * To remove custom field form row
     *
     * @param {boolean} isUpdate To check for API call
     * @param {number} index index number
     * @memberof ManageGroupsAccountsComponent
     */
    public removeCustomFieldRow(index: number, isUpdate: boolean): void {
        if (!isUpdate) {
            const row = this.customFieldForm.get('customField') as FormArray;
            if (row?.length > 0) {
                row.removeAt(index);
            }
        } else {
            const row = cloneDeep(this.customFieldForm.get('customField') as FormArray);
            if (row?.length > 0) {
                row.removeAt(index);
            }
            let requestObject = {
                customField: row.value
            }
            this.submitCustomFields(requestObject, 'delete');
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
            if (event.value === 'NUMERIC') {
                row.controls[index].get('valueLength').setValidators([Validators.required, Validators.max(30)]);
            } else if (event.value === 'STRING') {
                row.controls[index].get('valueLength').setValidators([Validators.required, Validators.max(150)]);
            }
        }
        row.controls[index].get('valueLength').setValue(null);
    }

    /**
     * To show check custom field validation
     *
     * @param {string} type
     * @param {number} index
     * @memberof ManageGroupsAccountsComponent
     */
    public checkValidation(type: string, index: number): void {
        const row = this.customFieldForm.get('customField') as FormArray;
        this.isCustomFormValid = true;
        if (type === 'name') {
            if (row.controls[index] && row.controls[index].get('key') && row.controls[index].get('key').value && row.controls[index].get('key').value.length > 50) {
                this.toasterService.errorToast(this.localeData?.name_length_validation);
                this.isCustomFormValid = false;
            }
        } else {
            if (row.controls[index].get('dataType').value === 'NUMERIC' && row.controls[index].get('valueLength').value > 30) {
                this.toasterService.warningToast(this.localeData?.number_length_validation);
                this.isCustomFormValid = false;

            } else if (row.controls[index].get('dataType').value === 'STRING' && row.controls[index].get('valueLength').value > 150) {
                this.toasterService.warningToast(this.localeData?.string_length_validation);
                this.isCustomFormValid = false;
            }
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
            this.dataTypeList = [
                { label: this.commonLocaleData?.app_datatype_list?.string, value: "STRING" },
                { label: this.commonLocaleData?.app_datatype_list?.number, value: "NUMERIC" },
                { label: this.commonLocaleData?.app_datatype_list?.boolean, value: "BOOLEAN" }
            ];
        }
    }
}
