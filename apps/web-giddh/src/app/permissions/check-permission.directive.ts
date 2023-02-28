import { IScope, PermissionDataService } from './permission-data.service';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[checkPermission]' })

export class CheckPermissionDirective implements OnInit {
    @Input() public checkPermission: string[];

    constructor(public el: ElementRef, public renderer: Renderer2, private _permissionDataService: PermissionDataService) {
    }

    public ngOnInit() {

        let permissions: IScope[] = this._permissionDataService.getData;
        // Use renderer to render the element with styles
        if (this.checkPermission && this.checkPermission.length === 2) {
            if (this.checkPermission[0] === 'MENU' && permissions) {
                let permissionIndex = permissions?.findIndex((ele) => ele.name === this.checkPermission[1]);
                if (!permissions?.length || permissionIndex === -1) {
                    this.renderer.setStyle(this.el?.nativeElement, 'display', 'none');
                }
            }
        }
    }
}
