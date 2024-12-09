import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'create-project',
    templateUrl: 'create-project.component.html',
    styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, OnDestroy {
    /** Holds true if api is in progress */
    public isLoading: boolean = true;
   

    constructor(

    ) {
        
    }

    public ngOnInit() {
        
    }

   

    public ngOnDestroy() {
       
    }
    
}
