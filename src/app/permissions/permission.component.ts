import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';

class Dude extends NavigationStart {
  public url: string;
}

@Component({
  template: '<router-outlet></router-outlet>'
})
export class PermissionComponent {
  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event: NavigationStart) => {
      if (event.url === '/pages/permissions' || event.url === '/pages/permissions/') {
        this.router.navigate(['/pages', 'permissions', 'list']);
      }
    });
  }

  // public this.router.setUpLocationChangeListener() {}
}
