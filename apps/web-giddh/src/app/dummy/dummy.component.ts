import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

@Component({
    selector: 'dummy',
    template: `
        <giddh-page-loader></giddh-page-loader>
  `
})
export class DummyComponent implements OnInit {
    constructor(private router: Router) { }

    /**
     * This  hook will call on component initialization
     *
     * @memberof DummyComponent
     */
    public ngOnInit(): void {
        setTimeout(() => {
            if (this.router.url === '/dummy') {
                this.router.navigate(['/pages/home']);
            }
        }, 3000);
    }

}
