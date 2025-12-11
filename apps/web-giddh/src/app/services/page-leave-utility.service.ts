import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PageLeaveUtilityService {
    // Placeholder implementation
    constructor() {}

    addBrowserConfirmationDialog(): void {
        // Placeholder method
    }

    removeBrowserConfirmationDialog(): void {
        // Placeholder method
    }

    openDialogWithoutAutoCleanup(): any {
        // Placeholder method for dialog reference
        return {
            afterClosed: () => ({ subscribe: (callback: any) => callback() })
        };
    }

    openDialog(): any {
        // Placeholder method for dialog reference
        return {
            afterClosed: () => ({ subscribe: (callback: any) => callback() })
        };
    }

    confirmPageLeave(callback: (confirmed: boolean) => void): void {
        // Placeholder method for page leave confirmation
        callback(true);
    }
}
