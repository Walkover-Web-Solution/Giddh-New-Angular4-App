import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit {
   /** Create Recipe  Stock  list */
   public stock:any = [];

  constructor() { }

  ngOnInit() {
  }

}
