import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'permission-model',
    templateUrl: './permission.model.component.html'
})

export class PermissionModelComponent {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Input() allRoles: Object;

    private items = ['one', 'two', 'three']; //mock data

    private role: object = {};
    constructor(private router: Router) {
    }

    public closePopupEvent() {
        this.closeEvent.emit(true);
    }

    public hideRoleModel() {
        this.closeEvent.emit(true);
    }

    /**
     * addNewRole
     * 
     */
    public addNewRole(data) {
        console.log("the data in addnewRole function is :", data);
        this.closeEvent.emit(true);
    }

    //addNewRole searching here
}