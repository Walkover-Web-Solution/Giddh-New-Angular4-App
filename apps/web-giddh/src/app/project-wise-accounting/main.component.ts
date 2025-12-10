import { Component } from "@angular/core";

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
standalone: false,
    template: "<router-outlet></router-outlet>"
})
export class MainComponent { }