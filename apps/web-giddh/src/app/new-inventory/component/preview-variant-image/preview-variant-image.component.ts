import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

/**
 * Handles Component functionality
 */
@Component({
    selector: "preview-variant-image",
    
    templateUrl: "./preview-variant-image.component.html",
    standalone: false,
    styleUrls: ["./preview-variant-image.component.scss"]
})
/**
 * PreviewVariantImageComponent component
 * Handles previewvariantimage functionality and user interactions
 */
export class PreviewVariantImageComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
