import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { INewRoleFormObj, IPage, IPageStr, NewRoleFormClass } from '../../permission.utility';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { PermissionState } from 'apps/web-giddh/src/app/store/permission/permission.reducer';
import { IRoleCommonResponseAndRequest } from 'apps/web-giddh/src/app/models/api-models/Permission';
import { forEach, omit } from '../../../lodash-optimized';

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class PermissionModelComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();

    public allRoles: INameUniqueName[] = [];
    public newRoleObj: INewRoleFormObj = new NewRoleFormClass();
    public dropdownHeading: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Fresh options list */
    public isFreshOptions = [];
    /** Holds Selected permissions */
    public selectedValues: any;

    constructor(private store: Store<AppState>, private permissionActions: PermissionActions) {
    }

    get isFormValid() {
        if (this.newRoleObj?.name && this.newRoleObj?.isFresh && this.getSelectedPagesCount() > 0) {
            return true;
        } else if (this.newRoleObj?.name && !this.newRoleObj?.isFresh && this.newRoleObj?.uniqueName) {
            return true;
        } else {
            return false;
        }
    }

    public ngOnInit() {
        setTimeout(() => {
            if (this.localeData) {
                this.isFreshOptions = [{
                    label: this.localeData?.fresh_start,
                    value: true
                },
                {
                    label: this.localeData?.copy_other_role,
                    value: false
                }];
                this.dropdownHeading = this.localeData?.select_pages;
            }
        }, 400);
        this.store.pipe(select(p => p.permission), takeUntil(this.destroyed$)).subscribe((p: PermissionState) => {
            if (p.roles && p.roles.length) {
                this.allRoles = [];
                forEach(p.roles, (role: IRoleCommonResponseAndRequest) => {
                    this.allRoles.push({ name: role?.name, uniqueName: role?.uniqueName });
                });
            }
            this.newRoleObj.isSelectedAllPages = false;
            this.newRoleObj.pageList = [];
            if (p.pages && p.pages.length) {
                p.pages.forEach((page: IPageStr) => {
                    this.newRoleObj.pageList.push({ name: page, isSelected: false });
                });
            }
        });

        this.store.dispatch(this.permissionActions.GetAllPages());
        this.newRoleObj.isFresh = true;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closePopupEvent() {
        this.closeEvent.emit('close');
    }

    public onDDShown() {
        this.dropdownHeading = this.localeData?.close_list;
    }

    public onDDHidden() {
        this.dropdownHeading = this.localeData?.select_pages;
    }

    /**
     * addNewRole
     */
    public addNewRole() {
        if (this.isFormValid) {
            let data;
            if (this.newRoleObj.isFresh) {
                data = omit(this.newRoleObj, 'uniqueName');
            } else {
                data = omit(this.newRoleObj, 'pageList');
            }
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
            this.closeEvent.emit('save');
        }
    }

    /**
     * Select all pages
     *
     * @param {*} event
     * @memberof PermissionModelComponent
     */
    public selectAllPages(event): void {
        if (event.checked) {
            this.selectedValues = [];
            this.newRoleObj.pageList.forEach((item: IPage) => {
                item.isSelected = true;
                this.selectedValues.push(item);
            });
            this.newRoleObj.isSelectedAllPages = true;
        } else {
            this.selectedValues = [];
            this.newRoleObj.pageList.forEach((item: IPage) => item.isSelected = false);
            this.newRoleObj.isSelectedAllPages = false;
        }
    }

    /**
     * Count number of pages are selected
     *
     * @returns {number}
     * @memberof PermissionModelComponent
     */
    public getSelectedPagesCount(): number {
        const selectedPages = this.newRoleObj.pageList.filter((item: IPage) => item.isSelected);
        return selectedPages?.length || 0;
    }

    /**
     * Enable/ Disable Select all pages checkbox
     *
     * @memberof PermissionModelComponent
     */
    public enableDisableSelectAll(): void {
        this.newRoleObj.isSelectedAllPages = this.getSelectedPagesCount() === this.newRoleObj.pageList?.length;
    }
}
