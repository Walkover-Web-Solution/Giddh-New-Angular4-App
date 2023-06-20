import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit, OnChanges {
    @Input() public variants: any[] = [];
    /** Create Recipe  Stock  list */
    public stock: any = [];
    public receiptObject: any = { manufacturingDetails: [] };
    public variantsList: any[] = [];

    constructor(

    ) {
        this.addNewRecipe();
    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.variants?.currentValue) {
            this.variantsList = [];

            changes?.variants?.currentValue?.forEach(variant => {
                this.variantsList.push({
                    label: variant.name,
                    value: variant.uniqueName
                });
            });
        }
    }

    public addNewRecipe(): void {
        this.receiptObject.manufacturingDetails.push({
            manufacturingQuantity: 1,
            manufacturingUnitUniqueName: '',
            variant: {
                name: '',
                uniqueName: ''
            },
            linkedStocks: [
                {
                    stockName: '',
                    stockUniqueName: '',
                    stockUnitCode: '',
                    stockUnitUniqueName: '',
                    quantity: 1,
                    variant: {
                        name: '',
                        uniqueName: ''
                    }
                }
            ]
        });
    }

    public addNewLinkedStockInRecipe(recipe: any): void {
        recipe.linkedStocks.push(
            {
                stockName: '',
                stockUniqueName: '',
                stockUnitCode: '',
                stockUnitUniqueName: '',
                quantity: 1,
                variant: {
                    name: '',
                    uniqueName: ''
                }
            }
        );
    }

}
