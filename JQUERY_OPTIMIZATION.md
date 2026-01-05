
// Replace jQuery with native DOM APIs:

// jQuery → Native DOM
$('#element')           → document.getElementById('element')
$('.class')            → document.querySelectorAll('.class')
$(element).addClass()   → element.classList.add()
$(element).removeClass() → element.classList.remove()
$(element).on('click')  → element.addEventListener('click')
$(element).hide()       → element.style.display = 'none'
$(element).show()       → element.style.display = 'block'

// For Angular components, use ViewChild and Renderer2:
@ViewChild('element') elementRef: ElementRef;
constructor(private renderer: Renderer2) {}

// Instead of jQuery manipulation:
this.renderer.addClass(this.elementRef.nativeElement, 'class-name');
