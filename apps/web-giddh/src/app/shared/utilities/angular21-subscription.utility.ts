import { Observable, Subscription, Subject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Angular 21-compatible subscription utility
 * Fixes the onDestroy errors by providing safe subscription management
 */
export class Angular21SubscriptionUtility {
    private subscriptions: Subscription[] = [];
    private destroyed$ = new ReplaySubject<boolean>(1);
    private isDestroying = false;

    /**
     * Safe subscription method that works with Angular 21's stricter lifecycle
     */
    public safeSubscribe<T>(
        observable: Observable<T>,
        next?: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        if (this.isDestroying) {
            return new Subscription(); // Return empty subscription if already destroying
        }

        const subscription = observable.subscribe({
            next: (value) => {
                if (!this.isDestroying && next) {
                    next(value);
                }
            },
            error: (err) => {
                if (!this.isDestroying && error) {
                    error(err);
                }
            },
            complete: () => {
                if (!this.isDestroying && complete) {
                    complete();
                }
            }
        });

        this.subscriptions.push(subscription);
        return subscription;
    }

    /**
     * Safe takeUntil that checks for component destruction
     */
    public safeTakeUntil<T>(): (source: Observable<T>) => Observable<T> {
        return (source: Observable<T>) => {
            if (this.isDestroying) {
                return new Observable(subscriber => {
                    subscriber.complete();
                });
            }
            return source.pipe(takeUntil(this.destroyed$));
        };
    }

    /**
     * Get the destroyed$ subject for use with takeUntil
     * Only use this if you're certain the component lifecycle is properly managed
     */
    public getDestroyedSubject(): Subject<boolean> {
        return this.destroyed$;
    }

    /**
     * Clean up all subscriptions - call this in ngOnDestroy
     */
    public destroy(): void {
        this.isDestroying = true;

        // Unsubscribe from all tracked subscriptions
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });

        this.subscriptions = [];

        // Complete the destroyed$ subject safely
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Check if the utility is in a destroying state
     */
    public isDestroyed(): boolean {
        return this.isDestroying;
    }
}

/**
 * Mixin for adding Angular 21-compatible subscription management to components
 */
export function Angular21SubscriptionMixin<T extends new (...args: any[]) => any>(Base: T) {
    return class extends Base {
        protected subscriptionUtility = new Angular21SubscriptionUtility();

        ngOnDestroy(): void {
            this.subscriptionUtility.destroy();

            // Call parent ngOnDestroy if it exists
            if (super.ngOnDestroy && typeof super.ngOnDestroy === 'function') {
                super.ngOnDestroy();
            }
        }

        /**
         * Safe subscription method for components
         */
        protected safeSubscribe<U>(
            observable: Observable<U>,
            next?: (value: U) => void,
            error?: (error: any) => void,
            complete?: () => void
        ): Subscription {
            return this.subscriptionUtility.safeSubscribe(observable, next, error, complete);
        }

        /**
         * Get destroyed$ subject for takeUntil operations
         */
        protected getDestroyed$(): Subject<boolean> {
            return this.subscriptionUtility.getDestroyedSubject();
        }
    };
}
