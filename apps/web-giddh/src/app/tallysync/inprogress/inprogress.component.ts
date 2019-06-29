import {Component, OnInit} from '@angular/core';
import {ToasterService} from "../../services/toaster.service";
import {TallySyncService} from "../../services/tally-sync.service";
import {TallySyncData} from "../../models/api-models/tally-sync";

@Component({
  selector: 'app-inprogress-preview',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogress.component.scss'],
})
export class InprogressComponent implements OnInit {
  public progressData: TallySyncData[];
  public MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(private _toaster: ToasterService, private tallysyncService: TallySyncService) {
  }

  public ngOnInit() {
    this.getCurrentData();
    setInterval(() => {
      this.getCurrentData();
    }, 60000);
  }

  public getCurrentData() {
    this.tallysyncService.getInProgressSync().subscribe((res) => {
      if (res && res.results && res.results.length > 0) {
        this.progressData = res.results;
        this.progressData.forEach((element) => {
          element['dateString'] = this.prepareDate(element.updatedAt);
          element['accountsPercent'] = element.totalTallyAccounts * element.totalSavedAccounts / 100;
          element['groupsPercent'] = element.totalTallyGroups * element.totalSavedGroups / 100;
          element['entriesPercent'] = element.totalTallyEntries * element.totalSavedEntries / 100;
        })
      }
    })
  }

  public prepareDate(dateArray: any) {
    if (dateArray[5] < 10) {
      dateArray[5] = '0' + dateArray[5];
    }
    return 'Last Import on ' + dateArray[2] + ' ' + this.MONTHS[dateArray[1]] + ' ' + dateArray[0] + ' @ ' + dateArray[3] + ':' + dateArray[4] + ':' + dateArray[5];
  }
}
