import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: false,
    template: '<router-outlet></router-outlet>'
})
export class PermissionComponent {
    constructor() {

    }
}
