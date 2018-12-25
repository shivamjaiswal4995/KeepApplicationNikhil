import { Directive, ElementRef, Renderer2, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHoverEffect]'
})
export class HoverEffectDirective {

  constructor(public ele: ElementRef, public renderer: Renderer2) {
  }

  @HostBinding('style.background-color') bgClr: string;

  @HostListener('mouseenter') onmouseenter() {
    // this.renderer.setStyle(this.ele.nativeElement, 'background-color', 'pink');
    this.bgClr = 'pink';
  }

  @HostListener('mouseleave') onmouseleave() {
    // this.renderer.removeStyle(this.ele.nativeElement, 'background-color');
    this.bgClr = null;
  }
}
