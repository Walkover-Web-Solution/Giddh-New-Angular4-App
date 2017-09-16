import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'new-user',
  template: `
  <div id="main">
  <app-header></app-header>
  <layout-main>
  </layout-main>
  <app-footer></app-footer>
</div>
  `
})
export class NewUserComponent {
  constructor() {
    //
  }
}
