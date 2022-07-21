import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as jsonTreeViewer from 'json-tree-viewer';
@Component({
    selector: 'activity-logs-json',
    templateUrl: './activity-logs-json.component.html',
    styleUrls: ['activity-logs-json.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityLogsJsonComponent implements OnInit, OnDestroy {
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
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        setTimeout(() => {
            jsonTreeViewer?.create(this.inputData, this.activityLogs?.nativeElement);
        }, 100);
        this.changeDetection.detectChanges();
    }

    /**
     * Life cycle hook runs when the component is destroyed
     *
     * @memberof ActivityLogsJsonComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.remove('cdk-overlay-container-z-index');
    }
}
