import { Component } from '@angular/core';

@Component({
  selector: 'tb-synram',
  templateUrl: './tb-synram.component.html',
  styleUrls: ['./tb-synram.component.css']
})
export class TbSynramComponent {
 

 ngOnInit() {
$(".exp").click(function(){
        $(".exp11").slideToggle();
		
    });
	$('#openingtr').click(function(){
   $('.openingcheck').toggle(this.checked);
   
   
   $('#transactionstr').click(function(){
  
   $('.transcheck').toggle(this.checked);
   
   
   $('#closingtr').click(function(){
   $('.closingcheck').toggle(this.checked);
   
});
	
	  }
	  
	  