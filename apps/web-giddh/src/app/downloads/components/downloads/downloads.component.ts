import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadsJsonComponent } from '../downloads-json/downloads-json.component';

export interface DownloadData {
    requestedDate: any;
    user: any;
    services: any;
    filter: any;
    download: any;
    expiry: any;
}

const ELEMENT_DATA: DownloadData[] = [
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: 'Expired' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: '04/07/2022' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: 'Expired' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: '04/07/2022' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: '04/07/2022' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: 'Expired' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: 'Expired' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: '04/07/2022' },
    { requestedDate: '04/07/2022', user: 'User 1', services: 'Services 1', filter: 'Filter 1', download: 'Download 1', expiry: '04/07/2022' }
];


@Component({
    selector: 'downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.scss'],
})

export class DownloadsComponent implements OnInit, OnDestroy {
    /* it will store image path */
    public imgPath: string = '';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public staticJson =
        {
            "ip": "IP",
            "operation": "Operation",
            "activity_logs": "Activity Logs",
            "get_logs": "Get Logs",
            "no_logs": "You can change the filters to fetch logs",
            "user": "User",
            "date": "Log Date",
            "compare": "Compare",
            "show_change_data": "Show Changed Data",
            "no_difference": "No difference",
            "no_history": "No history available for this log",
            "history": "History",
            "no_history_found": "No History Found",
            "ip2": "IP",
            "operation2": "Operation",
            "activity_logs2": "Activity Logs",
            "get_logs2": "Get Logs",
            "no_logs2": "You can change the filters to fetch logs",
            "user2": "User",
            "date2": "Log Date",
            "compare2": "Compare",
            "show_change_data2": "Show Changed Data",
            "no_difference2": "No difference",
            "no_history2": "No history available for this log",
            "history2": "History",
            "no_history_found2": "No History Found"
        }

    displayedColumns: string[] = ['requestedDate', 'user', 'services', 'filter', 'download', 'expiry'];
    dataSource = ELEMENT_DATA;

    constructor(public dialog: MatDialog) { }

    /**
     * Initializes the component
     *
     * @memberof DownloadsComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        document.querySelector('body')?.classList?.add('download-page');
    }

    /**
     * Opens the Sidebar popup
     *
     * @memberof DownloadsComponent
     */
    public openDialog(): void {

        const dialogRef = this.dialog.open(DownloadsJsonComponent, {
            data: this.staticJson,
            panelClass: 'download-json-panel'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    /**
     * Releases the memory
     *
     * @memberof DownloadsComponent
    */
    public ngOnDestroy(): void {
        document.querySelector('body')?.classList?.remove('download-page');
    }
}
