import { Component, Inject, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as jsonTreeViewer from 'json-tree-viewer';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'exports-json',
    
    standalone: false,templateUrl: './exports-json.component.html',
    styleUrls: ['./exports-json.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * ExportsJsonComponent component
 * Handles exportsjson functionality and user interactions
 */
export class ExportsJsonComponent implements OnInit {

    /** Instance of activity logs json */
    @ViewChild('jsonData', { static: false }) public jsonData: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) { }

    /**
     * Initializes the Component
     *
     * @memberof ExportsJsonComponent
     */
    public ngOnInit(): void {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            jsonTreeViewer?.create(this.inputData, this.jsonData?.nativeElement);
        }, 100);
    }
}