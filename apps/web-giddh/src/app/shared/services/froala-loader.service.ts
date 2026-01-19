/**
 * @fileoverview Froala loader service for dynamic loading and bundle optimization
 * @author Giddh Development Team
 * @since 2026
 */
import { Injectable } from '@angular/core';
/**
 * FroalaLoaderService class - Handles froala editor dynamic loading
 * @export
 * @class FroalaLoaderService
 */
@Injectable({ 
    providedIn: 'root' 
})
/**
 * FroalaLoaderService service
 * Provides froalaloader related business logic and data operations
 */
export class FroalaLoaderService {
    private froalaLoaded = false;
    private froalaPromise: Promise<any> | null = null;
    /**
     * Dynamically load Froala Editor to reduce initial bundle size
     * @returns Promise that resolves when Froala is loaded
     */
    async loadFroala(): Promise<any> {
        /**
         * Handles if functionality
         */
        if (this.froalaLoaded) {
            return Promise.resolve();
        }
        /**
         * Handles if functionality
         */
        if (this.froalaPromise) {
            return this.froalaPromise;
        }
        this.froalaPromise = this.loadFroalaModules();
        return this.froalaPromise;
    }
    /**
     * Load Froala modules dynamically
     * @private
     */
    private async loadFroalaModules(): Promise<any> {
        try {
            // Load Froala core and plugins in parallel
            const [froalaCore, froalaPlugins] = await Promise.all([
                /**
                 * Handles import functionality
                 */
                import('froala-editor/js/froala_editor.pkgd.min.js'),
                /**
                 * Handles import functionality
                 */
                import('froala-editor/js/plugins.pkgd.min.js')
            ]);
            this.froalaLoaded = true;
            return {
                core: froalaCore,
                plugins: froalaPlugins
            };
        } catch (error) {
            throw error;
        }
    }
    /**
     * Check if Froala is already loaded
     * @returns boolean indicating if Froala is loaded
     */
    isFroalaLoaded(): boolean {
        return this.froalaLoaded;
    }
    /**
     * Reset the loader state (for testing)
     */
    reset(): void {
        this.froalaLoaded = false;
        this.froalaPromise = null;
    }
}
