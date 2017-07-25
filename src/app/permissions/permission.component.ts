import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  template: '<router-outlet></router-outlet>'
})
export class PermissionComponent implements OnInit {
  constructor(private router: Router, private location: Location) {
  }
  public ngOnInit() {
    if (this.location.path() === '/pages/permissions' || this.location.path() === '/pages/permissions/') {
      this.router.navigate(['/pages', 'permissions', 'list']);
    }
  }
}
