import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { VoucherComponentStore } from "../vouchers.component.store";

@Component({
    selector: "create",
    templateUrl: "./create.component.html",
    styleUrls: ["./create.component.scss"],
    providers: [VoucherComponentStore]
})
export class VoucherCreateComponent implements OnInit, OnDestroy {
    public moduleType: string = "";

    constructor(
        private activatedRoute: ActivatedRoute,
        private componentStore: VoucherComponentStore
    ) {

    }

    public ngOnInit(): void {
        
    }

    public ngOnDestroy(): void {
        
    }
    
}