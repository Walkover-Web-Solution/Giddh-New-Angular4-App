import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe', standalone: false })
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    public transform(html: any): any {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
