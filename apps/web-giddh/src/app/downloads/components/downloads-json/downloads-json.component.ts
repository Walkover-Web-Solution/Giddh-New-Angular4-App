import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as jsonTreeViewer from 'json-tree-viewer';

@Component({
    selector: 'downloads-json',
    templateUrl: './downloads-json.component.html',
    styleUrls: ['./downloads-json.component.scss']
})

export class DownloadsJsonComponent implements OnInit {

    /** Instance of activity logs json */
    @ViewChild('jsonData', { static: false }) public jsonData: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(@Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) { }

    /**
     * Initializes the Component
     *
     * @memberof DownloadsJsonComponent
     */
    public ngOnInit(): void {
        setTimeout(() => {
            jsonTreeViewer?.create(this.inputData, this.jsonData?.nativeElement);
        }, 100);
    }
}