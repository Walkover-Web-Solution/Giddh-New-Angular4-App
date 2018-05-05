import { Store } from '@ngrx/store';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store';

@Component({
  selector: 'upload-file',  // <home></home>
  styleUrls: ['./upload-file.component.scss'],
  templateUrl: './upload-file.component.html'
})

export class UploadFileComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() public onFileUpload = new EventEmitter();
  public file: File = null;

  constructor(
    private store: Store<AppState>,
    private _router: Router,
  ) {
  }

  public ngOnInit() {
    //
  }

  public ngAfterViewInit(): void {
    //
  }

  public ngOnDestroy() {
    //
  }

  public onFileChange(file: FileList) {
    this.file = file.item(0);
  }
}
