import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PAGE_SIZE_OPTIONS } from '../../../../app.constant';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    customTab: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', customTab: 'Custom Tab 1' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', customTab: 'Custom Tab 2' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', customTab: 'Custom Tab 3' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', customTab: 'Custom Tab 4' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', customTab: 'Custom Tab 5' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', customTab: 'Custom Tab 6' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', customTab: 'Custom Tab 7' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', customTab: 'Custom Tab 8' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', customTab: 'Custom Tab 9' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', customTab: 'Custom Tab 10' },
];

@Component({
    selector: 'group-wise',
    templateUrl: './group-wise.component.html',
    styleUrls: ['./group-wise.component.scss']
})
export class GroupwiseComponent implements OnInit,AfterViewInit {
    /** Holds images folder path */
    public imgPath: string = "";
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Holds total items count */
    public totalItems: number = 500;

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'customTab'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    constructor(@Inject(ServiceConfig) private serviceConfig,  private liveAnnouncer: LiveAnnouncer) {}

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    /**
     * Lifecycle hook for initialization
     *
     * @memberof GroupwiseComponent
     */
    ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }

    /**
     * after init
     *
     * @memberof GroupwiseComponent
     */
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Handles pagination events for group-wise inventory
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof GroupwiseComponent
     */
    public handlePageEvent(event: PageEvent): void {
        // In a real implementation, this would update API request parameters
        // and fetch new data based on the page index and page size
        console.log('Page event', event);
    }

    /**
     * Function for sorting data
     *
     * @param {Sort} sortState
     * @memberof GroupwiseComponent
     */
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this.liveAnnouncer.announce('Sorting cleared');
        }
    }
}
