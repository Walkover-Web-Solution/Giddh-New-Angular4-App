import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    constructor() {}

    successToast(message: string, title?: string): void {
        console.log('Success:', message);
    }

    errorToast(message: string, title?: string, duration?: number): void {
        console.error('Error:', message);
    }

    warningToast(message: string, title?: string): void {
        console.warn('Warning:', message);
    }

    infoToast(message: string, title?: string): void {
        console.info('Info:', message);
    }

    clearAllToaster(): void {
        // Placeholder method
    }

    successToastWithHtml(message: string): void {
        console.log('Success HTML:', message);
    }
}
