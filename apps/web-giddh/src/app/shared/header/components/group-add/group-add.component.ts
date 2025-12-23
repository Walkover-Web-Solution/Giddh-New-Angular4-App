import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/roots';
import { GroupWithAccountsAction } from '../../../../actions/groupwithaccounts.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { GroupCreateRequest } from '../../../../models/api-models/Group';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';
import { digitsOnly } from '../../../helpers';
import { AccountsAction } from 'apps/web-giddh/src/app/actions/accounts.actions';

@Component({
    selector: 'group-add',
    templateUrl: 'group-add.component.html',
    styleUrls: ['group-add.component.scss'],
    standalone: false
})

export class GroupAddComponent implements OnInit, OnDestroy {
    /** Localized text data specific to this component */
    @Input() public localeData: any = {};
    /** Common localized text data shared across components */
    @Input() public commonLocaleData: any = {};
    /** Breadcrumb path array for navigation context */
    @Input() public path: string[] = [];
    /** Observable stream of the currently active group's unique name */
    public activeGroupUniqueName$: Observable<string>;
    /** Reactive form group for managing group creation form data */
    public groupDetailForm: FormGroup;
    /** Observable indicating whether the add new group form should be displayed */
    public showAddNewGroup$: Observable<boolean>;
    /** Observable indicating whether group creation is currently in progress */
    public isCreateGroupInProcess$: Observable<boolean>;
    /** Observable indicating whether group creation was successful */
    public isCreateGroupSuccess$: Observable<boolean>;
    /** ViewChild reference to the auto-focused input element */
    @ViewChild('autoFocused', { static: true }) public autoFocus: ElementRef;
    /** Subject for managing component destruction and unsubscribing from observables */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private accountsAction: AccountsAction
    ) {
        this.activeGroupUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.showAddNewGroup$ = this.store.pipe(select(state => state.groupwithaccounts.showAddNewGroup), takeUntil(this.destroyed$));
        this.isCreateGroupInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.isCreateGroupInProcess), takeUntil(this.destroyed$));
        this.isCreateGroupSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.isCreateGroupSuccess), distinctUntilChanged(), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.initForm();

        this.groupDetailForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.store.dispatch(this.accountsAction.hasUnsavedChanges(this.groupDetailForm.dirty));
        });

        this.groupDetailForm.get('closingBalanceTriggerAmount').valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(amount => {
            if (!this.groupDetailForm.get('closingBalanceTriggerAmountType')?.value) {
                this.groupDetailForm.get('closingBalanceTriggerAmountType')?.patchValue('CREDIT');
            }
        });

        this.isCreateGroupSuccess$.subscribe(a => {
            if (a) {
                this.groupDetailForm?.markAsPristine();
                this.groupDetailForm.reset({
                    name: '',
                    uniqueName: '',
                    description: '',
                    closingBalanceTriggerAmount: 0,
                    closingBalanceTriggerAmountType: 'CREDIT'
                });
                setTimeout(() => {
                    this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                }, 500);
            }
        });

        this.groupDetailForm.get('name').valueChanges.pipe(debounceTime(100), takeUntil(this.destroyed$)).subscribe(name => {
            let val: string = name;
            val = uniqueNameInvalidStringReplace(val);
            if (val) {
                this.groupDetailForm?.patchValue({ uniqueName: val });
            } else {
                this.groupDetailForm?.patchValue({ uniqueName: '' });
            }
        });
        setTimeout(() => {
            this.autoFocus?.nativeElement.focus();
        }, 50);
    }

    /**
     * Initializes the reactive form group for adding or editing an account.
     * 
     * @returns FormGroup
     * @memberof GroupAddComponent
     */
    public initForm(): void {
        this.groupDetailForm = this.formBuilder.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            description: [''],
            closingBalanceTriggerAmount: [0, digitsOnly],
            closingBalanceTriggerAmountType: ['CREDIT']
        });
    }

    public addNewGroup() {
        let activeGrpUniqueName: string;
        let uniqueName = this.groupDetailForm.get('uniqueName');
        uniqueName?.patchValue(uniqueName?.value?.replace(/ /g, '')?.toLowerCase());

        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGrpUniqueName = a);

        let grpObject: GroupCreateRequest;
        grpObject = this.groupDetailForm?.value as GroupCreateRequest;
        grpObject.uniqueName = grpObject?.uniqueName;
        grpObject.parentGroupUniqueName = activeGrpUniqueName;
        grpObject.path = this.path;
        // add bredcrum to payload
        this.store.dispatch(this.groupWithAccountsAction.createGroup(grpObject));
    }

    public closingBalanceTypeChanged(type: string) {
        if (Number(this.groupDetailForm.get('closingBalanceTriggerAmount')?.value) > 0) {
            this.groupDetailForm.get('closingBalanceTriggerAmountType')?.patchValue(type);
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
