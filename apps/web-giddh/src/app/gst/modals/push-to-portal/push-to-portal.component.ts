import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'push-to-portal',
    templateUrl: './push-to-portal.component.html',
    styleUrls: ['./push-to-portal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushToPortalComponent {
    /** This will hold local JSON data */
    @Input() public localeData;
    /** This will emit the download excel  for gstr1 */
    @Output() public downloadExcel: EventEmitter<any> = new EventEmitter();
    /** This will emit the download json  for gstr1 */
    @Output() public downloadJson: EventEmitter<any> = new EventEmitter();
    /** Holds GST return govt link */
    public gstReturnGovtLink: string = 'https://www.gst.gov.in/download/returns';
    /**
     * This will use for download success sheet
     *
     * @param {Event} event
     * @memberof PushToPortalComponent
     */
    public onDownloadExcel(event: Event): void {
        this.downloadExcel.emit(event);
    }

    /**
    * This will use for download success sheet
    *
    * @param {Event} event
    * @memberof PushToPortalComponent
    */
    public onDownloadJson(event: Event): void {
        this.downloadJson.emit(event);
    }
}
