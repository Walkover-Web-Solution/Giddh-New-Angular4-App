import { Component } from '@angular/core';
import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
import { CommonModule } from '@angular/common';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'call-back-page',
    templateUrl: './call-back-page.component.html',
    styleUrls: ['./call-back-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        GiddhPageLoaderModule
    ]
})
/**
 * CallBackPageComponent component
 * Handles callbackpage functionality and user interactions
 */
export class CallBackPageComponent {
    /** Hold broadcast event */
    public broadcast: any;
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        this.closePopup();
    }

    /**
   * Close window popup
   *
   * @memberof CallBackPageComponent
   */
    private closePopup(): void {
        this.setBroadcastEvent(true);
        window.close();
    }

/**
 * This will be used to set a broadcast event to call the api for capture order.
 *
 * @private
 * @param {boolean} type
 * @memberof CallBackPageComponent
 */
private setBroadcastEvent(type: boolean): void {
        this.broadcast = new BroadcastChannel("call-back-subscription");
        this.broadcast.postMessage({ success: type });
    }
}
