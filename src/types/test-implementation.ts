import { DOMContext } from './geo-map';

export interface TestMapImplementation<T> {
  context: DOMContext;
  el: HTMLElement;
  map: T;
}

export interface TestServiceImplementation<T> {
  context: DOMContext;
  el: HTMLElement;
  service: T;
}
