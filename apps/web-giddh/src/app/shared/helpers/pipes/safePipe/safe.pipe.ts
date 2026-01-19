import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Handles Pipe functionality
 */
@Pipe({ name: 'safe', standalone: false })
/**
 * SafePipe pipe
 * Implements SafePipe functionality
 */
export class SafePipe implements PipeTransform {
    /**
     * Creates an instance of pipe
     * Initializes component dependencies and sets up initial state
     */
    constructor(private sanitizer: DomSanitizer) {
    }

    /**
     * Handles transform functionality
     */
    public transform(html: any): any {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
