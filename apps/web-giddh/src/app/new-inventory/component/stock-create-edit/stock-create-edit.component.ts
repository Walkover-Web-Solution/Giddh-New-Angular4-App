import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
    selector: "stock-create-edit",
    templateUrl: "./stock-create-edit.component.html",
    styleUrls: ["./stock-create-edit.component.scss"]
})
export class StockCreateEditComponent implements OnInit, OnDestroy {
    public separatorKeysCodes: any[] = [ENTER, COMMA];
    /* this will store image path*/
    public imgPath: string = "";
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public stockForm: any = {
        type: 'PRODUCT'
    };

    constructor(
    ) {
    }

    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public addOption(event: MatChipInputEvent): void {
        const value = (event.value || "").trim();

        // Clear the input value
        // tslint:disable-next-line:no-non-null-assertion
        event.chipInput!.clear();
    }

    public removeOption(value: any): void {
        // const index = this.category.indexOf(categorys);

        // if (index >= 0) {
        //     this.category.splice(index, 1);
        // }
    }
}
