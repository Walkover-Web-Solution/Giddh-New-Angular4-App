import { Component, OnChanges, OnDestroy, OnInit } from "@angular/core";

@Component({
    selector: "attachments",
    templateUrl: "./attachments.component.html",
    styleUrls: ["./attachments.component.scss"]
})
export class AttachmentsComponent implements OnInit, OnChanges, OnDestroy {

    // adding items in dialog list
    names: string[] = ['item 1', 'item 2', 'item 3', 'item 4', 'item 5', 'item 6', 'item 7', 'item 8', 'item 9', 'item 10'];

    constructor(

    ) {

    }

    public ngOnInit(): void {

    }

    public ngOnChanges(): void {

    }

    public ngOnDestroy(): void {

    }
}