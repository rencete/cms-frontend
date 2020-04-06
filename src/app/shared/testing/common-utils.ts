import { ComponentFixture } from '@angular/core/testing';

export function newEvent(eventName: string, bubbles = false, cancelable = false) {
  let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}

interface WithValueAndDispatchEvent {
  value: string,
  dispatchEvent: (Event) => boolean
}

export function setElementValueWithInputEvent<T extends WithValueAndDispatchEvent>(
  element: T,
  valueToBeSet: string
): void {
  element.value = valueToBeSet;
  element.dispatchEvent(newEvent('input'));
}