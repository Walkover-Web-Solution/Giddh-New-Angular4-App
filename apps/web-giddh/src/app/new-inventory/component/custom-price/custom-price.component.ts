import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

@Component({
    selector: "custom-price",
    templateUrl: "./custom-price.component.html",
    styleUrls: ["./custom-price.component.scss"]
})
export class CustomPriceComponent implements OnInit, OnDestroy {
    /** Instance of create unit component */
    @ViewChild("createUnit", { static: false }) public createUnit: any;
    /** Instance of create unit group component */
    @ViewChild("createUnitGroup", { static: false }) public createUnitGroup: any;
    /** Holds unit groups */
    public unitGroups: any[] = [];
    /** Holds unit mappings */
    public unitMappings: any[] = [];
    /** Modal instance */
    public matDialogRef: any;
    /** Holds unit details */
    public unitDetails: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if get all unit groups api call in progress */
    public isGroupListLoading: boolean = false;
    /** True if get all units api call in progress */
    public isUnitListLoading: boolean = false;
    /** Holds if edit form has data loaded */
    public hasEditFormLoaded: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds selected group data */
    public selectedGroup: any = {};
    /** Holds selected unit index */
    public selectedUnitIndex: number = null;
    /** Holds selected unit group index */
    public selectedUnitGroupIndex: number = null;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */

    constructor(
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CustomPriceComponent
     */
    public ngOnInit(): void {
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CustomPriceComponent
     */
    public ngOnDestroy(): void {
    }

    /**
     * Track by function
     *
     * @param {number} index
     * @param {*} item
     * @returns {void}
     * @memberof CustomPriceComponent
     */
}