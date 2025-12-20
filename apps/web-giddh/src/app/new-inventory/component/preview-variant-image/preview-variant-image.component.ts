import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "preview-variant-image",
    
    templateUrl: "./preview-variant-image.component.html",
    standalone: false,
    styleUrls: ["./preview-variant-image.component.scss"]
})
export class PreviewVariantImageComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData
    ) { }

    /**
     * This will be use for component initialization
     *
     * @memberof PreviewVariantImageComponent
     */
    public ngOnInit(): void {
        this.inputData.variant.uploadedFile = `data:image/${this.inputData.variant.fileType};base64,${this.inputData.variant.uploadedFile}`;
    }

    /**
     * Hook cycle for component destroy
     *
     * @memberof PreviewVariantImageComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
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

        // Safely complete the destroyed$ subject
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
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
