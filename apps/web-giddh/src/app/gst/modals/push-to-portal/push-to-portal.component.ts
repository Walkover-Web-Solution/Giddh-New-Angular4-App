import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { GST_UTILITY_DOWNLOAD_LINK } from '../../../app.constant';
@Component({
    selector: 'push-to-portal',
    templateUrl: './push-to-portal.component.html',
    styleUrls: ['./push-to-portal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushToPortalComponent {
    /** This will hold local JSON data */
    @Input() public localeData;
    /** This will hold common JSON data */
    @Input() public commonLocaleData;
    /** This will emit the download excel  for gstr1 */
    @Output() public downloadExcel: EventEmitter<any> = new EventEmitter();
    /** This will emit the download json  for gstr1 */
    @Output() public downloadJson: EventEmitter<any> = new EventEmitter();
    /** Holds GST utility download link */
    public gstUtilityDownloadLink: string = GST_UTILITY_DOWNLOAD_LINK;
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
