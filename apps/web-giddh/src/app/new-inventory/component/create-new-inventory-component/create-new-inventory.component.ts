import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

export interface Category {
    name: string;
}


@Component({
    selector: "create-new-inventory",
    templateUrl: "./create-new-inventory.component.html",
    styleUrls: ["./create-new-inventory.component.scss"],

})

export class CreateNewInventoryComponent implements OnInit {
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    category: Category[] = [
        { name: "S" },
        { name: "M" },
        { name: "L" },
        { name: "LG" },
        { name: "XL" },
    ];


    /* add readonly if bulk edit is true */
    public editBulk: boolean = false;
    /* this will store image path*/
    public imgPath: string = "";
    /* this will store hsn boolean value */
    public isHSN: boolean = true;
    /* this will store product boolean value */
    public isProduct: boolean = true;
    public isService: boolean = false;
    public isCombo: boolean = false;
    public isBulkCreation: boolean = false;
    public formGroupRadio: FormGroup;
    /* this will store expense boolean value */
    public isExpense: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private fb: FormBuilder,
    ) {
    }

    public ngOnInit() {
        // add group form
        this.formGroupRadio = this.fb.group({
            radioType: [""],
        });
        // enable disable parentGroup select
        this.formGroupRadio.controls["radioType"].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value === "product") {
                this.isProduct = true;
                this.isService = false;
                this.isCombo = false;
                this.isBulkCreation = false;
            } else if (value === "service") {
                this.isProduct = false;
                this.isService = true;
                this.isCombo = false;
                this.isBulkCreation = false;
            } else if (value === "combo") {
                this.isProduct = false;
                this.isService = false;
                this.isCombo = true;
                this.isBulkCreation = false;
            } else if (value === "bulkCreation") {
                this.isProduct = false;
                this.isService = false;
                this.isCombo = false;
                this.isBulkCreation = true;
            }
        });
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

    public selectCode(isHSN: any): void {
        this.isHSN = isHSN;
    }

    public toggleExpense(isExpense: any): void {
        this.isExpense = isExpense;
    }


    public add(event: MatChipInputEvent): void {
        const value = (event.value || "").trim();

        // Add our fruit
        if (value) {
            this.category.push({ name: value });
        }

        // Clear the input value
        // tslint:disable-next-line:no-non-null-assertion
        event.chipInput!.clear();
    }

    public remove(categorys: Category): void {
        const index = this.category.indexOf(categorys);

        if (index >= 0) {
            this.category.splice(index, 1);
        }
    }
}
