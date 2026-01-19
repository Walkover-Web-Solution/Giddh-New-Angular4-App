import { Component, OnInit } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
  selector: 'app-list-recipe',
  
  templateUrl: './list-recipe.component.html',
    standalone: false,
  styleUrls: ['./list-recipe.component.scss']
})
/**
 * ListRecipeComponent component
 * Handles listrecipe functionality and user interactions
 */
export class ListRecipeComponent implements OnInit {

  /**
   * Creates an instance of component
   * Initializes component dependencies and sets up initial state
   */
  constructor() { }

  /**
   * Handles ngOnInit functionality
   */
  ngOnInit() {
  }

}
