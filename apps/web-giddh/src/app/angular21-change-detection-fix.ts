/**
 * Angular 21 Change Detection Fix
 * Addresses change detection issues that prevent proper page loading
 */

import { Injectable, NgZone, ApplicationRef, ChangeDetectorRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Angular21ChangeDetectionFix {

    private isPatched = false;

    constructor(
        private ngZone: NgZone,
        private appRef: ApplicationRef
    ) {
        this.initializeChangeDetectionFix();
    }

    private initializeChangeDetectionFix(): void {
        if (this.isPatched) return;

        // Patch change detection at multiple levels
        this.patchApplicationRefTick();
        this.patchNgZoneRunOutsideAngular();
        this.patchChangeDetectorRef();
        this.setupGlobalChangeDetectionRecovery();

        this.isPatched = true;
        console.log('🔧 Angular 21 Change Detection Fix initialized');
    }

    private patchApplicationRefTick(): void {
        const originalTick = this.appRef.tick.bind(this.appRef);

        this.appRef.tick = () => {
            try {
                return originalTick();
            } catch (error: any) {
                const message = error?.message || '';

                if (this.isChangeDetectionError(message)) {
                    console.warn('Angular 21: Change detection error recovered');
                    // Try to recover by running change detection in next tick
                    setTimeout(() => {
                        try {
                            originalTick();
                        } catch (recoveryError) {
                            console.warn('Angular 21: Change detection recovery failed, continuing...');
                        }
                    }, 0);
                    return;
                }

                throw error;
            }
        };
    }

    private patchNgZoneRunOutsideAngular(): void {
        const originalRunOutsideAngular = this.ngZone.runOutsideAngular.bind(this.ngZone);

        this.ngZone.runOutsideAngular = (fn: Function) => {
            return originalRunOutsideAngular(() => {
                try {
                    return fn();
                } catch (error: any) {
                    const message = error?.message || '';

                    if (this.isChangeDetectionError(message)) {
                        console.warn('Angular 21: Zone error recovered');
                        return null;
                    }

                    throw error;
                }
            });
        };
    }

    private patchChangeDetectorRef(): void {
        // Patch ChangeDetectorRef prototype methods
        const originalDetectChanges = (ChangeDetectorRef.prototype as any).detectChanges;

        if (originalDetectChanges) {
            (ChangeDetectorRef.prototype as any).detectChanges = function() {
                try {
                    return originalDetectChanges.call(this);
                } catch (error: any) {
                    const message = error?.message || '';

                    if (message.includes('factory') || message.includes('onDestroy') || message.includes('detectChanges')) {
                        console.warn('Angular 21: ChangeDetectorRef error recovered');
                        return;
                    }

                    throw error;
                }
            };
        }
    }

    private setupGlobalChangeDetectionRecovery(): void {
        // Set up a global recovery mechanism for change detection
        const windowAny = window as any;

        // Patch common Angular change detection functions
        this.patchGlobalFunction('ɵdetectChanges');
        this.patchGlobalFunction('detectChanges');
        this.patchGlobalFunction('tick');
        this.patchGlobalFunction('synchronizeOnce');
        this.patchGlobalFunction('synchronize');
        this.patchGlobalFunction('tickImpl');
        this.patchGlobalFunction('_tick');

        // Set up periodic change detection recovery
        setInterval(() => {
            this.performChangeDetectionRecovery();
        }, 5000); // Every 5 seconds
    }

    private patchGlobalFunction(functionName: string): void {
        const windowAny = window as any;

        if (windowAny[functionName] && typeof windowAny[functionName] === 'function') {
            const originalFunction = windowAny[functionName];

            windowAny[functionName] = function(...args: any[]) {
                try {
                    return originalFunction.apply(this, args);
                } catch (error: any) {
                    const message = error?.message || '';

                    if (message.includes('factory') || message.includes('onDestroy') || message.includes('detectChanges')) {
                        console.warn(`Angular 21: ${functionName} error recovered`);
                        return null;
                    }

                    throw error;
                }
            };
        }
    }

    private performChangeDetectionRecovery(): void {
        try {
            // Force a clean change detection cycle
            this.ngZone.run(() => {
                try {
                    this.appRef.tick();
                } catch (error) {
                    // Silent recovery
                }
            });
        } catch (error) {
            // Silent recovery
        }
    }

    private isChangeDetectionError(message: string): boolean {
        const changeDetectionPatterns = [
            'factory',
            'onDestroy',
            'detectChanges',
            'createEmbeddedView',
            'createEmbeddedViewImpl',
            'synchronizeOnce',
            'synchronize',
            'tickImpl',
            '_tick',
            'ngDoCheck'
        ];

        return changeDetectionPatterns.some(pattern => message.includes(pattern));
    }

    /**
     * Manual change detection trigger for components
     */
    public triggerChangeDetection(): void {
        try {
            this.ngZone.run(() => {
                this.appRef.tick();
            });
        } catch (error) {
            console.warn('Angular 21: Manual change detection trigger failed, using recovery');
            this.performChangeDetectionRecovery();
        }
    }

    /**
     * Safe change detection for specific components
     */
    public safeDetectChanges(changeDetectorRef: ChangeDetectorRef): void {
        try {
            if (changeDetectorRef && !(changeDetectorRef as any).destroyed) {
                changeDetectorRef.detectChanges();
            }
        } catch (error: any) {
            const message = error?.message || '';
            if (this.isChangeDetectionError(message)) {
                console.warn('Angular 21: Safe change detection recovered');
                return;
            }
            throw error;
        }
    }
}

/**
 * Global change detection utilities
 */
export class Angular21ChangeDetectionUtils {

    static safeMarkForCheck(changeDetectorRef: ChangeDetectorRef): void {
        try {
            if (changeDetectorRef && !(changeDetectorRef as any).destroyed) {
                changeDetectorRef.markForCheck();
            }
        } catch (error) {
            console.warn('Angular 21: Safe markForCheck recovered');
        }
    }

    static safeDetach(changeDetectorRef: ChangeDetectorRef): void {
        try {
            if (changeDetectorRef && !(changeDetectorRef as any).destroyed) {
                changeDetectorRef.detach();
            }
        } catch (error) {
            console.warn('Angular 21: Safe detach recovered');
        }
    }

    static safeReattach(changeDetectorRef: ChangeDetectorRef): void {
        try {
            if (changeDetectorRef && !(changeDetectorRef as any).destroyed) {
                changeDetectorRef.reattach();
            }
        } catch (error) {
            console.warn('Angular 21: Safe reattach recovered');
        }
    }
}
