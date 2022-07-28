import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'mobile-restricted',
    templateUrl: './mobile-restricted.component.html',
    styleUrls: ['./mobile-restricted.component.scss']
})

export class MobileRestrictedComponent implements OnInit{
    /** Holds images folder path */
    public imgPath: string = "";

    constructor() {}

    public ngOnInit(){
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    }

}