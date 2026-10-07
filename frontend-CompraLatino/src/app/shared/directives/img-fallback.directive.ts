import { Directive, ElementRef, inject } from '@angular/core';

const FALLBACK_SRC = '/images/placeholder.svg';

/** Replaces a broken remote image with a local placeholder (only once, to avoid loops). */
@Directive({
  selector: 'img[appImgFallback]',
  host: { '(error)': 'onError()' },
})
export class ImgFallbackDirective {
  private readonly img = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

  onError(): void {
    if (!this.img.src.endsWith(FALLBACK_SRC)) {
      this.img.src = FALLBACK_SRC;
    }
  }
}
