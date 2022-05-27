import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as jsondiffpatch from "jsondiffpatch"
@Component({
    selector: 'activity-compare-json',
    templateUrl: './activity-compare-json.component.html',
    styleUrls: ['activity-compare-json.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCompareJsonComponent implements OnInit {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will use for json difference */
    public jsonDifference: any;
    /** This will use for show changed difference */
    public showChanged: boolean = true;

    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef, private renderer: Renderer2,
        public dialogRef: MatDialogRef<any>) {
    }

    /**
     * This will use for call intialization component
     *
     * @memberof ActivityCompareJsonComponent
     */
    public ngOnInit(): void {
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        setTimeout(() => {
            const differ = new jsondiffpatch.DiffPatcher();
            const delta = differ?.diff(this.inputData[0], this.inputData[1]);
            this.jsonDifference = jsondiffpatch.formatters.html.format(delta, this.inputData[0]);
            this.changeDetection.detectChanges();
        }, 100);
    }
}
