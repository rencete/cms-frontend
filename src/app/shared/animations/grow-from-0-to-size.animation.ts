import { animation, animate, style, transition } from '@angular/animations';

export const growFrom0ToSize = animation([
  style({ height: '0px' }),
  animate("{{time}} cubic-bezier(0.0,0.0,0.2,1)")
]);