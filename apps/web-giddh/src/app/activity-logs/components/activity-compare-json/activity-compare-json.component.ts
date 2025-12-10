import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as jsondiffpatch from "jsondiffpatch";
@Component({
    selector: 'activity-compare-json',
standalone: false,
    templateUrl: './activity-compare-json.component.html',
    styleUrls: ['activity-compare-json.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCompareJsonComponent implements OnInit, OnDestroy {
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
            const differ = jsondiffpatch.create();
            const delta = differ.diff(this.inputData[0], this.inputData[1]);
            // Use simple diff display for now - jsondiffpatch formatters API changed
            this.jsonDifference = delta ? `<pre>${JSON.stringify(delta, null, 2)}</pre>` : '<p>No differences found</p>';
            this.changeDetection.detectChanges();
        }, 100);
    }

    /**
     * Life cycle hook runs when the component is destroyed
     *
     * @memberof ActivityCompareJsonComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('.cdk-overlay-container')?.classList?.remove('cdk-overlay-container-z-index');
    }
}
