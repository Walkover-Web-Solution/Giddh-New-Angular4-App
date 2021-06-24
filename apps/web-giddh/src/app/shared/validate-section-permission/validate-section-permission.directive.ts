import { Directive, ElementRef, Input, OnChanges, Renderer2 } from "@angular/core";

@Directive({
    selector: '[validateSectionPermission]'
})

export class ValidateSectionPermissionDirective implements OnChanges {
    @Input() public hasPermission: boolean = true;
    @Input() public errorMessage: string = "You don't have permission to view this";

    constructor(
        private elementRef: ElementRef, 
        private renderer: Renderer2) {
    }

    /**
     * Checks permissions and show/hide element
     *
     * @memberof ValidateSectionPermissionDirective
     */
    public ngOnChanges(): void {
        if(!this.hasPermission) {
            if(!this.elementRef.nativeElement?.parentElement?.parentElement?.querySelector(".giddh-permission-error-message")) {
                const errorDiv = this.renderer.createElement('div');
                const errorText = this.renderer.createText(this.errorMessage);
                errorDiv?.classList?.add("giddh-permission-error-message");
                this.renderer.appendChild(errorDiv, errorText);

                this.renderer.appendChild(this.elementRef.nativeElement?.parentElement, errorDiv);
            }
            this.elementRef.nativeElement?.classList?.add('giddh-no-permissions');
        } else {
            this.elementRef.nativeElement?.classList?.remove('giddh-no-permissions');
        }
    }
}