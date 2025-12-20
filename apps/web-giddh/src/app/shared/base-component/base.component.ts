import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Base component with Angular 21-compatible subscription management
 * Fixes the onDestroy errors by properly handling component destruction timing
 */
@Component({
    template: '',
    standalone: false
})
export abstract class BaseComponent implements OnDestroy {
    /**
     * Array to track all subscriptions for manual cleanup
     * This is more reliable than takeUntil in Angular 21
     */
    protected subscriptions: Subscription[] = [];

    /**
     * Flag to track if component is being destroyed
     * Prevents accessing destroyed properties
     */
    protected isDestroying = false;

    /**
     * Safe subscription method that tracks subscriptions for cleanup
     * Use this instead of direct .subscribe() calls
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }

    /**
     * Angular 21-compatible ngOnDestroy implementation
     * Safely cleans up all subscriptions before component destruction
     */
    ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });

        // Clear the subscriptions array
        this.subscriptions = [];

        // Call custom cleanup if implemented by child component
        this.onComponentDestroy();
    }

    /**
     * Override this method in child components for custom cleanup logic
     * This is called after all subscriptions are safely cleaned up
     */
    protected onComponentDestroy(): void {
        // Override in child components if needed
    }

    /**
     * Safe method to check if component is still active
     * Use this before accessing component properties in async operations
     */
    protected isComponentActive(): boolean {
        return !this.isDestroying;
    }
}
