import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'push-to-portal',
    templateUrl: './push-to-portal.component.html',
    styleUrls: ['./push-to-portal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PushtToPortalComponent {
    /** This will hold local JSON data */
    @Input() public localeData;
    /** This will emit the download excel  for gstr1 */
    @Output() public downloadExcel: EventEmitter<any> = new EventEmitter();
    /** This will emit the cancel popup  hide */
    @Output() public cancelCallBack: EventEmitter<any> = new EventEmitter();
    /** This will emit the download json  for gstr1 */
    @Output() public downloadJson: EventEmitter<any> = new EventEmitter();

    /**
     * This will use for download success sheet
     *
     * @param {Event} event
     * @memberof PushtToPortalComponent
     */
    public onDownloadExcel(event: Event): void {
        this.downloadExcel.emit(event);
    }

    /**
 * This will use for download success sheet
 *
 * @param {Event} event
 * @memberof PushtToPortalComponent
 */
    public onDownloadJson(event: Event): void {
        this.downloadJson.emit(event);
    }

    /**
     *This will emit the cancel popup  hide
     *
     * @param {Event} event
     * @memberof PushtToPortalComponent
     */
    public onCancel(event: Event): void {
        this.cancelCallBack.emit(event);
    }
}
