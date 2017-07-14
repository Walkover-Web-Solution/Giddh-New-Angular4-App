import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html'
})

export class PermissionModelComponent implements OnDestroy {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);

    public allRoles: object;
    private newRole: object = {};
    private pageNames = [];
    private selectedPages = [];

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(private router: Router, private store: Store<AppState>) {
        this.store.select(p => p.permission.roles).takeUntil(this.destroyed$).subscribe((roles) => {
            this.allRoles = roles;
            if (this.allRoles[1]) {
                this.pageNames = this.allRoles[1].scopes;
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closePopupEvent() {
        this.closeEvent.emit(true);
    }

    public hideRoleModel() {
        this.closeEvent.emit(true);
    }

    public selectPages(pageName) {
        let indx = this.selectedPages.findIndex(function (item) {
            return item == pageName;
        });
        if (indx === -1) {
            this.selectedPages.push(pageName);
        } else {
            this.selectedPages.splice(indx, 1);
        }
    }

    /**
     * addNewRole
     */
    public addNewRole(data) {
        if (data.copyoption === 'copy_permission') {
            data.scopes = this.pageNames;
            data.pages = [];
        } else if (data.copyoption === 'select_heads') {
            data.pages = this.selectedPages;
            data.scopes = null;
        }

        console.log("the data in addnewRole function is :", data);

        this.closeEvent.emit(true);
    }
}