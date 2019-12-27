import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styles: [`
    `]
})
export class FooterComponent implements OnInit, AfterViewInit {
    public title: Observable<string>;
    public languages: any[] = [{ name: 'ENGLISH', value: 'en' }, { name: 'DUTCH', value: 'nl' }];

    /**
     *
     */
    // tslint:disable-next-line:no-empty
    constructor() {
    }

    // tslint:disable-next-line:no-empty
    public ngOnInit() {
    }

    // tslint:disable-next-line:no-empty
    public ngAfterViewInit() {
    }
}
