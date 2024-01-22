import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.scss"]
})
export class VoucherListComponent implements OnInit, OnDestroy {
    public moduleType: string = "";

    constructor(
        private activatedRoute: ActivatedRoute
    ) {

    }

    public ngOnInit(): void {
        
    }

    public ngOnDestroy(): void {
        
    }
}