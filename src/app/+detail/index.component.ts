import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

console.log('async DEATILS');

@Component({
  selector: 'index',
  directives: [
    ...ROUTER_DIRECTIVES
  ],
  template: `
    <router-outlet></router-outlet>
  `
})
export class Index {

}
