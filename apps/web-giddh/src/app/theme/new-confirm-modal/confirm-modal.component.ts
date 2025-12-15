import { Component } from '@angular/core';

@Component({
    selector: 'app-confirm-modal',
    template: `
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Confirm Action</h4>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to proceed?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary">Cancel</button>
                <button type="button" class="btn btn-primary">Confirm</button>
            </div>
        </div>
    `,
    standalone: false
})
export class ConfirmModalComponent {
    constructor() {}
}
