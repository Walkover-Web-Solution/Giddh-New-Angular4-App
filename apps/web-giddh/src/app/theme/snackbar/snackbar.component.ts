import { Component } from '@angular/core';

@Component({
    selector: 'app-snackbar',
    template: `
        <div class="snackbar">
            <span class="message">{{ message }}</span>
            <button class="close-btn" (click)="close()">&times;</button>
        </div>
    `,
    styles: [`
        .snackbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background-color: #323232;
            color: white;
            border-radius: 4px;
        }
        .close-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
        }
    `],
    standalone: false
})
export class SnackbarComponent {
    message: string = '';

    constructor() {}

    close() {
        // Close logic
    }
}
