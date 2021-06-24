import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
    selector: '[validateSectionPermission]'
})

export class ValidateSectionPermissionDirective implements OnChanges {
    @Input() public hasPermission: boolean = true;
    @Input() public errorMessage: string = "You don't have permission to view this";

    constructor(private elementRef: ElementRef) {

    }

    /**
     * Initializes the directive
     *
     * @memberof ValidateSectionPermissionDirective
     */
    public ngOnChanges(): void {
        if(!this.hasPermission) {
            //this.elementRef.nativeElement.innerHTML = this.errorMessage;
            this.elementRef.nativeElement.classList.add('giddh-no-permissions');
        } else {
            this.elementRef.nativeElement.classList.remove('giddh-no-permissions');
        }
    }
}