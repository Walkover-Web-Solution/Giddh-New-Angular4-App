import { Component, OnInit } from "@angular/core";

@Component({
    selector: "apple-login-callback",
    templateUrl: "./apple-login-callback.component.html",
    styleUrls: ["./apple-login-callback.component.scss"]
})
export class AppleLoginCallbackComponent implements OnInit {

    constructor (

    ) {

    }

    public ngOnInit(): void {
        //window.opener.postMessage({ origin: 'giddh', data: "" }, "*");
        //window.close();
    }
}