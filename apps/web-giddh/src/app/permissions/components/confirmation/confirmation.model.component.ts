import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';

@Component({
    selector: 'delete-role-confirmation-model',
    templateUrl: './confirmation.model.component.html'
})

export class DeleteRoleConfirmationModelComponent implements OnInit {
    @Input() public selectedRoleForDelete: IRoleCommonResponseAndRequest;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** This will hold confirmation message */
    public confirmationMessage: string = "";

    /**
     * Initializes the component
     *
     * @memberof DeleteRoleConfirmationModelComponent
     */
    public ngOnInit(): void {
        this.confirmationMessage = this.localeData?.role_delete_content;

        if (this.selectedRoleForDelete && this.selectedRoleForDelete.name) {
            this.confirmationMessage = this.confirmationMessage?.replace("[ROLE]", "<b>" + this.selectedRoleForDelete.name + "</b>");
        } else {
            this.confirmationMessage = this.confirmationMessage?.replace("[ROLE]", "");
        }
    }

    public onConfirmation() {
        this.confirmDeleteEvent.emit(true);
    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }
}
