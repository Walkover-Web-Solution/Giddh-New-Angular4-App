import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'create-project',
    templateUrl: 'create-project.component.html',
    styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, OnDestroy {
    /** Holds true if api is in progress */
    public isLoading: boolean = true;
   /* This will hold local JSON data */
   public localeData: any = {};
   /* This will hold common JSON data */
   public commonLocaleData: any = {};

    constructor(
        private dialogRef: MatDialogRef<CreateProjectComponent>
    ) {
        
    }

    public ngOnInit() {
        
    }

    public ngOnDestroy() {
       
    }
    
}
