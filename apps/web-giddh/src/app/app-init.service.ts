import { Injectable } from '@angular/core';
import { DynamicThemeService } from './shared/services/dynamic-theme.service';

/**
 * Service for application initialization tasks
 * @memberof AppModule
 */
@Injectable({
    providedIn: 'root'
})
export class AppInitService {

    constructor(private dynamicThemeService: DynamicThemeService) {}

    /**
     * Initializes the application with dynamic theme
     * @param {any} whiteLabelConfig - White label configuration object
     * @returns Promise<void>
     * @public
     */
    public init(whiteLabelConfig: any): Promise<void> {
        return new Promise((resolve) => {
            // Apply dynamic theme after DOM is ready
            setTimeout(() => {
                this.dynamicThemeService.applyThemeFromConfig(whiteLabelConfig);
                resolve();
            }, 200);
        });
    }
}
