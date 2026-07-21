import { Injectable, effect, signal } from '@angular/core';

export const FONT_SIZE_STEPS = [0, 1, 2, 3];

@Injectable({ providedIn: 'root' })
export class FontSizeService {
  adjustPx = signal<number>(0);

  constructor() {
    effect(() => {
      document.documentElement.style.setProperty('--font-size-adjust', `${this.adjustPx()}px`);
    });
  }

  setAdjust(px: number): void {
    this.adjustPx.set(px);
  }
}
