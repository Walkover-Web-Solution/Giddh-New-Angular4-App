import { Component, Inject } from "@angular/core";
import { ServiceConfig } from "../../../services/service.config";

@Component({
    selector: 'add-ons',
    templateUrl: './add-ons.component.html',
    styleUrls: ['./add-ons.component.scss'],
})

export class AddOnsComponent{

    /**  Image path variable */
    public imgPath: string = '';
    constructor(@Inject(ServiceConfig) private serviceConfig ){}
    public ngOnInit(): void{
        /** This will use for image format */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
