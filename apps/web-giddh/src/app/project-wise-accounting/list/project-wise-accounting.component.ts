
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CreateProjectComponent } from '../components/create-project/create-project.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

export interface projectDetails {
    name: string;
    position: number;
    status: string;
    symbol: string;
    action: string;
  }
  
  const ELEMENT_DATA: projectDetails[] = [
    {position: 1, name: 'Project 1', status: 'ACTIVE', symbol: 'H', action: ''},
    {position: 2, name: 'Project 2', status: 'ACTIVE', symbol: 'He',action: ''},
    {position: 3, name: 'Project 3', status: 'ACTIVE', symbol: 'Li', action: ''},
  ];
  

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
    public dataSource: projectDetails[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
    dataToDisplay = [...ELEMENT_DATA];

    constructor(
        public dialog: MatDialog,

    ) {}

    public ngOnInit() {
        this.dataSource = this.dataToDisplay;  
    }

    public ngOnDestroy() {

    }
    /**
     * 
     */
    public openCreateProjectDialog(){
        const dialogRef = this.dialog.open(CreateProjectComponent, {
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                top: '0'
            }
        })
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
          });
    }

}
