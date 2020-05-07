import { animation, animate, style, transition } from '@angular/animations';

export const shrinkFromSizeTo0 = animation([
  animate("{{time}} cubic-bezier(0.4,0.0,1,1)",
    style({ height: '0px' }))
]);