import { Component } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'gst-pages',
  templateUrl: './gst-pages.component.html',
  styleUrls: ['gst-pages.component.css'],
})
export class GstPagesComponent {
  constructor() {
    //
  }
  
  
  ngOnInit() {
       $('.tabs_new a').on('click', function (event) {
			event.preventDefault();
			
			$('.tabs_new li').removeClass('active');
			$(this).parent().addClass('active');
			$('.tab1div').hide();
			$($(this).attr('href')).show();
		});
		
		$('#tab_2').on('click', function (event) {
			
			$('#subtabs').show();
			
		});
		$('#tab_1').on('click', function (event) {
			
			$('#hidebox').show();
			
		});
		$('.back-button').on('click', function (event) {
			
			$('#hidebox').show();
			$('#tab-1').show();
			$('#fillterid').hide();
			
		});
		$('#tab_1, #tab_3').on('click', function (event) {
			
			$('#subtabs').hide();
			
		});
$('.transactions-summary-table tbody tr').on('click', function (event) {
			
			$('#fillterid').show();
			$('#hidebox').hide();
			
		});
		
	
		
		$('.sub-filter-nav-band ul li a').on('click', function (event) {
			event.preventDefault();
			
			$('.sub-filter-nav-band ul li').removeClass('active');
			$(this).parent().addClass('active');
			$('.subtabs-box').hide();
			$($(this).attr('href')).show();
		});
		
		
		$('.filter').each(function() {
    var $dropdown = $(this);

    $(".dropdown-toggle", $dropdown).click(function(e) {
      e.preventDefault();
      $(".dropdown-menu", $dropdown).toggle();
      return false;
	  
    });

});
    
  $('html').click(function(){
    $(".dropdown-menu").hide();
  });
	
	   
    }
  
}
  
  
 
 
