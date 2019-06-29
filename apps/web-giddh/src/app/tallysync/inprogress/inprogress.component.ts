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

  constructor(private _toaster: ToasterService, private tallysyncService: TallySyncService) {
  }

  public ngOnInit() {
    this.getCurrentData();
    setInterval(() => {
      this.getCurrentData();
    }, 30000);
  }

  public getCurrentData() {
    this.tallysyncService.getInProgressSync().subscribe((res) => {
      if (res && res.results && res.results.length>0) {
        this.progressData = res.results;
      }
    })

  }
}
