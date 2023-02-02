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

@Component({
    selector: 'group-add',
    templateUrl: 'group-add.component.html'
})

export class GroupAddComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() public path: string[] = [];
    public activeGroupUniqueName$: Observable<string>;
    public groupDetailForm: FormGroup;
    public showAddNewGroup$: Observable<boolean>;
    public isCreateGroupInProcess$: Observable<boolean>;
    public isCreateGroupSuccess$: Observable<boolean>;
    @ViewChild('autoFocused', { static: true }) public autoFocus: ElementRef;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _fb: FormBuilder, private store: Store<AppState>, private groupWithAccountsAction: GroupWithAccountsAction) {
        this.activeGroupUniqueName$ = this.store.pipe(select(state => state.groupwithaccounts.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.showAddNewGroup$ = this.store.pipe(select(state => state.groupwithaccounts.showAddNewGroup), takeUntil(this.destroyed$));
        this.isCreateGroupInProcess$ = this.store.pipe(select(state => state.groupwithaccounts.isCreateGroupInProcess), takeUntil(this.destroyed$));
        this.isCreateGroupSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.isCreateGroupSuccess), distinctUntilChanged(), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.groupDetailForm = this._fb.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            description: [''],
            closingBalanceTriggerAmount: [0, Validators.compose([digitsOnly])],
            closingBalanceTriggerAmountType: ['CREDIT']
        });

        this.isCreateGroupSuccess$.subscribe(a => {
            if (a) {
                this.groupDetailForm.reset();
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

    public addNewGroup() {
        let activeGrpUniqueName: string;
        let uniqueName = this.groupDetailForm.get('uniqueName');
        uniqueName?.patchValue(uniqueName?.value?.replace(/ /g, '').toLowerCase());

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
