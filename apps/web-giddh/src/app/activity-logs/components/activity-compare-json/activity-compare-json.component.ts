import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Renderer2,
    OnDestroy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { create } from 'jsondiffpatch';
import { format } from 'jsondiffpatch/formatters/html';
import { remove } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'activity-compare-json',
    templateUrl: './activity-compare-json.component.html',
    styleUrls: ['activity-compare-json.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * ActivityCompareJsonComponent component
 * Handles activitycomparejson functionality and user interactions
 */
export class ActivityCompareJsonComponent implements OnInit, OnDestroy {

    public localeData: any = {};
    public jsonDifference: any;
    public showChanged: boolean = true;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        private changeDetection: ChangeDetectorRef,
        private renderer: Renderer2,
        public dialogRef: MatDialogRef<any>
    ) { }

    /**
     * Handles ngOnInit functionality
     */
    ngOnInit(): void {
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });

        /**
         * Sets timeout value
         */
        setTimeout(() => {
            const differ = create();
            const delta = differ.diff(this.inputData[0], this.inputData[1]);

            /**
             * Handles if functionality
             */
            if (delta) {
                this.jsonDifference =
                    /**
                     * Handles format functionality
                     */
                    format(delta, this.inputData[0]);
            }

            this.changeDetection.detectChanges();
        }, 100);
    }

    /**
     * Handles ngOnDestroy functionality
     */
    ngOnDestroy(): void {
        document
            .querySelector('.cdk-overlay-container')
            ?.classList?.remove('cdk-overlay-container-z-index');
    }
}
