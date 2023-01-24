import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'dummy',
    template: `
        <giddh-page-loader></giddh-page-loader>
  `
})
export class DummyComponent implements OnInit {
    constructor(private route: Router) { }

    /**
     * This  hook will call on component initialization
     *
     * @memberof DummyComponent
     */
    public ngOnInit(): void {
        setTimeout(() => {
            this.route.navigate(['/pages/home']);
        }, 3000);
    }

}
