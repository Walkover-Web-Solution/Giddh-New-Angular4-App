import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { PermissionActions } from '../../../actions/permission/permission.action';
import { INewRoleFormObj, IPage, IPageStr, NewRoleFormClass } from '../../permission.utility';
import { INameUniqueName } from '../../../models/api-models/Inventory';
import { PermissionState } from 'apps/web-giddh/src/app/store/permission/permission.reducer';
import { IRoleCommonResponseAndRequest } from 'apps/web-giddh/src/app/models/api-models/Permission';
import { IOption, isSelectedAllOption } from '../../../app.constant';
import { cloneDeep, filter, find, forEach, omit } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html',
    styleUrls: ['./permission.model.component.scss'],
    standalone: false
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
    /** Selected page names, or [SELECTED_ALL_OPTION] when All is chosen */
    public selectedValues: Array<string | number> = [];
    /** Role options for reactive-dropdown-field */
    public roleOptions: IOption[] = [];
    /** Page dropdown options with capitalized labels */
    public pageOptions: IOption[] = [];

    constructor(
        private store: Store<AppState>,
        private permissionActions: PermissionActions,
        private generalService: GeneralService
    ) {
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
                this.roleOptions = [];
                forEach(p.roles, (role: IRoleCommonResponseAndRequest) => {
                    this.allRoles.push({ name: role?.name, uniqueName: role?.uniqueName });
                    this.roleOptions.push({
                        value: role?.uniqueName,
                        label: role?.name
                    });
                });
            }
            this.newRoleObj.isSelectedAllPages = false;
            this.newRoleObj.pageList = [];
            this.pageOptions = [];
            this.selectedValues = [];
            if (p.pages && p.pages.length) {
                (Array.isArray(p.pages) ? p.pages : []).forEach((page: IPageStr) => {
                    this.newRoleObj.pageList.push({ name: page, isSelected: false });
                    this.pageOptions.push({
                        value: page as string,
                        label: this.capitalizePageName(page as string)
                    });
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
            this.onPagesSelected(this.selectedValues);
            let data;
            if (this.newRoleObj.isFresh) {
                data = omit(cloneDeep(this.newRoleObj), 'uniqueName');
                data.selectedValues = this.selectedValues;
            } else {
                data = omit(cloneDeep(this.newRoleObj), 'pageList');
            }
            this.generalService.replaceSelectedAllOptions(data);
            this.store.dispatch(this.permissionActions.PushTempRoleInStore(data));
            this.closeEvent.emit('save');
        }
    }

    /**
     * Syncs pageList.isSelected from the dropdown value, including All.
     *
     * @param {Array<string | number>} selected
     * @memberof PermissionModelComponent
     */
    public onPagesSelected(selected: Array<string | number>): void {
        this.selectedValues = selected ?? [];
        const selectAll = isSelectedAllOption(this.selectedValues);
        (Array.isArray(this.newRoleObj.pageList) ? this.newRoleObj.pageList : []).forEach((item: IPage) => {
            item.isSelected = selectAll || this.selectedValues.includes(item.name);
        });
        this.newRoleObj.isSelectedAllPages = selectAll || this.getSelectedPagesCount() === this.newRoleObj.pageList?.length;
    }

    /**
     * Count number of pages are selected
     *
     * @returns {number}
     * @memberof PermissionModelComponent
     */
    public getSelectedPagesCount(): number {
        if (isSelectedAllOption(this.selectedValues)) {
            return this.newRoleObj.pageList?.length || 0;
        }
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

    /**
     * Handles role selection from reactive-dropdown-field
     *
     * @param {IOption} selectedRole - The selected role option
     * @memberof PermissionModelComponent
     */
    public onRoleSelect(selectedRole: IOption): void {
        if (selectedRole) {
            this.newRoleObj.uniqueName = selectedRole.value;
            // Find the corresponding role and update isSelected property
            const role = this.allRoles.find(r => r.uniqueName === selectedRole.value);
            if (role) {
                // Reset all roles selection state
                (Array.isArray(this.allRoles) ? this.allRoles : []).forEach(r => (r as any).isSelected = false);
                // Set selected role
                (role as any).isSelected = true;
                this.enableDisableSelectAll();
            }
        }
    }

    /**
     * Gets the selected role name for display
     *
     * @returns {string} The selected role name
     * @memberof PermissionModelComponent
     */
    public get selectedRoleName(): string {
        const selectedRole = this.roleOptions.find(role => role.value === this.newRoleObj.uniqueName);
        return selectedRole ? selectedRole.label : '';
    }

    /**
     * Capitalizes a page name the same way as the capitalize pipe.
     *
     * @private
     * @param {string} name
     * @returns {string}
     * @memberof PermissionModelComponent
     */
    private capitalizePageName(name: string): string {
        if (!name) {
            return '';
        }
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
}
