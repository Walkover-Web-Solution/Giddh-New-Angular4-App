import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'dashboardcomponent',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
 
})

export class DashboardComponent implements OnInit {
    public imgPath: string = '';
ngOnInit(){
    this.imgPath = (isElectron||isCordova)  ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
}

}