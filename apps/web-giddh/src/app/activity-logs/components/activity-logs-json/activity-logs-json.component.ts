import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as jsonTreeViewer from 'json-tree-viewer';
@Component({
    selector: 'activity-logs-json',
    templateUrl: './activity-logs-json.component.html',
    styleUrls: ['activity-logs-json.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityLogsJsonComponent implements OnInit {
    /** Instance of activity logs json */
    @ViewChild('activityLogs', { static: false }) public activityLogs: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};

    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef,
        public dialogRef: MatDialogRef<any>) {
    }

    /**
     * This will use for call intialization component
     *
     * @memberof ActivityLogsJsonComponent
     */
    public ngOnInit(): void {
        console.log(this.inputData);
        console.log(jsonTreeViewer);

        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        setTimeout(() => {
            jsonTreeViewer?.create(this.inputData, this.activityLogs?.nativeElement);
        }, 100);
        this.changeDetection.detectChanges();
    }
}
