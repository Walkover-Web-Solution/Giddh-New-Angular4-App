import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InventoryComponentStore } from "../inventory.store";

@Component({
    selector: "preview-variant-image",
    templateUrl: "./preview-variant-image.component.html",
    styleUrls: ["./preview-variant-image.component.scss"],
    providers: [InventoryComponentStore]
})
export class PreviewVariantImageComponent implements OnInit, OnDestroy {
    /** Stock search request */
    public stockSearchRequest: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private componentStore: InventoryComponentStore,
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>
    ) { }

    /**
     * This will be use for component initialization
     *
     * @memberof PreviewVariantImageComponent
     */
    public ngOnInit(): void {
        console.log(this.inputData);
        this.inputData.uploadedFile = `data:image/${this.inputData.fileType};base64,${this.inputData.uploadedFile}`;
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
