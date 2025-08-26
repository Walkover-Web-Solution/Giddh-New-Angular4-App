import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'welcome-jobwork',
    templateUrl: './welcome-jobwork.component.html'
})
export class JobworkWelcomeComponent implements OnDestroy {
    /** Template reference for aside pane */
    @ViewChild('asideMenuTemplate', { static: true }) public asideMenuTemplate: TemplateRef<any>;
    /** Reference for aside pane dialog */
    public asideMenuDialogRef: MatDialogRef<any>;
    /** Subject to destroy subscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private dialog: MatDialog) {
    }

    /**
     * Opens the aside pane dialog
     *
     * @memberof JobworkWelcomeComponent
     */
    public openTransferAsidePaneDialog(): void {
        this.asideMenuDialogRef = this.dialog.open(this.asideMenuTemplate, ASIDE_PANE_CONFIG);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
