import { Component } from "@angular/core";

@Component({
    selector: 'add-ons',
    templateUrl: './add-ons.component.html',
    styleUrls: ['./add-ons.component.scss'],
})

export class AddOnsComponent{
    
    /**  Image path variable */
    public imgPath: string = '';

    public ngOnInit(): void{
        /** This will use for image format */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}