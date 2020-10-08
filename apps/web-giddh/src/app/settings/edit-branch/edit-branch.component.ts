import { Component, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.scss']
})
export class EditBranchComponent implements OnInit {
  public accountAsideMenuState: string = 'out';
  public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public ngOnInit(): void {
  }

  constructor() { }

  public closeAsidePane(event) {
      this.ngOnDestroy();
      this.closeAsideEvent.emit(event);
  }
  
  public ngOnDestroy(): void {
  }
 

}
