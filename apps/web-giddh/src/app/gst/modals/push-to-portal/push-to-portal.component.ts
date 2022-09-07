import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
@Component({
    selector: 'push-to-portal',
    templateUrl: './push-to-portal.component.html',
    styleUrls: ['./push-to-portal.component.scss']
})
export class PushtToPortalComponent implements OnInit {
    /** This will hold local JSON data */
    @Input() public localeData;
    /** This will emit the download excel  for gstr1 */
    @Output() public downloadExcel: EventEmitter<any> = new EventEmitter();
    /** This will emit the cancel popup  hide */
    @Output() public cancelCallBack: EventEmitter<any> = new EventEmitter();
    /** This will emit the download json  for gstr1 */
    @Output() public downloadJson: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    /**
     * Initializes the component
     *
     * @memberof PushtToPortalComponent
     */
    public ngOnInit(): void {}

    /**
     * This will use for download success sheet
     *
     * @param {Event} e
     * @memberof PushtToPortalComponent
     */
    public onDownloadExcel(e: Event): void {
        this.downloadExcel.emit(e);
    }

    /**
 * This will use for download success sheet
 *
 * @param {Event} e
 * @memberof PushtToPortalComponent
 */
    public onDownloadJson(e: Event): void {
        this.downloadJson.emit(e);
    }

    /**
     *This will emit the cancel popup  hide
     *
     * @param {Event} e
     * @memberof PushtToPortalComponent
     */
    public onCancel(e: Event): void {
        this.cancelCallBack.emit(e);
    }
}
