import { DOMContext, BrowserCtx } from './geo-map';

export type TestMapImplementation<T> = BrowserCtx<{
  el: HTMLElement;
  map: T;
}>;

export type TestServiceImplementation<T> = BrowserCtx<{
  el: HTMLElement;
  service: T;
}>;
