import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "preview-variant-image",
    templateUrl: "./preview-variant-image.component.html",
    styleUrls: ["./preview-variant-image.component.scss"]
})
export class PreviewVariantImageComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
