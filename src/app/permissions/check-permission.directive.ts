import { PermissionDataService } from './permission-data.service';
import { Directive, ElementRef, Input, Renderer, OnInit } from '@angular/core';
import * as _ from 'lodash';
@Directive({ selector: '[checkPermission]' })

export class CheckPermissionDirective implements OnInit {
  @Input() public checkPermission: string[];

  constructor(public el: ElementRef, public renderer: Renderer, private _permissionDataService: PermissionDataService) {}
  public ngOnInit() {

    let permissions = this._permissionDataService.getData;
    // Use renderer to render the element with styles
    if (this.checkPermission && this.checkPermission.length === 2) {
      if (this.checkPermission[0] === 'MENU') {
        if (!permissions.length || permissions.indexOf(this.checkPermission[1]) === -1) {
          this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
          console.log('not found: ', this.checkPermission[1]);
        }
      }
    }
  }
}
