
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateProjectComponent } from '../components/create-project/create-project.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'project-wise-accounting',
    styleUrls: ['./project-wise-accounting.component.scss'],
    templateUrl: './project-wise-accounting.component.html'
})
export class ProjectWiseAccountingListComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if get all discounts api call in progress */
    public isLoading: boolean = false;

    constructor(
        public dialog: MatDialog,

    ) {

    }

    public ngOnInit() {

    }

    public ngOnDestroy() {

    }
    
    /**
     * 
     */
    public openCreateProjectDialog(){
        this.dialog.open(CreateProjectComponent, {
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                top: '0'
            }
        })
        // this.dialog.afterAllClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {}
    }
}
