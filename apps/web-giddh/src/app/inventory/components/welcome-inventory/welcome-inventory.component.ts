import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'welcome-inventory',
    templateUrl: './welcome-inventory.component.html',
    styleUrls: ['./welcome-inventory.scss'],
    standalone: false
})
export class InventoryWelcomeComponent implements OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Template reference for aside menu */
    @ViewChild('asideMenuTemplate', { static: true }) public asideMenuTemplate: TemplateRef<any>;
    /** Dialog reference for aside menu */
    public asideMenuDialogRef: MatDialogRef<any>;

    constructor(private dialog: MatDialog) {
    }

    /**
     * Opens the aside pane dialog
     *
     * @memberof InventoryWelcomeComponent
     */
    public openAsidePaneDialog(): void {
        this.asideMenuDialogRef = this.dialog.open(this.asideMenuTemplate, ASIDE_PANE_CONFIG);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
