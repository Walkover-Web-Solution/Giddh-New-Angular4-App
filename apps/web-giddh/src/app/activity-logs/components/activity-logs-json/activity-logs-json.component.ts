import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as jsonTreeViewer from 'json-tree-viewer';

@Component({
    selector: 'activity-logs-json',
    templateUrl: './activity-logs-json.component.html',
    styleUrls: ['activity-logs-json.component.scss']
})

export class ActivityLogsJsonComponent implements OnInit {
    /** Instance of rejected activity log component */
    @ViewChild('activityLogs', { static: false }) public activityLogs: ElementRef;

    constructor(@Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {
    }
    
    /**
     * This will use for call intialization component
     *
     * @memberof ActivityLogsTableComponent
     */
    public ngOnInit(): void {
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        setTimeout(() => {
            jsonTreeViewer?.create(this.inputData, this.activityLogs.nativeElement);
        }, 100);
    }
}
