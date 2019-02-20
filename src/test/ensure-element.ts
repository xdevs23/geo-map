import * as Types from '../types';
import { DOMContext } from '../types';

export function ensureElement(
  provider: Types.GeoMapProvider,
  context: DOMContext
): HTMLDivElement {
  const rootEl = context.window.document.body; // getElementById('root') as HTMLElement;
  const previous = context.window.document.querySelector(
    `[data-map="${provider}"]`
  );

  if (previous && previous.parentElement) {
    previous.parentElement.removeChild(previous);
  }

  const el = context.window.document.createElement('div');
  el.setAttribute('data-map', provider);
  el.setAttribute('style', 'display: flex; width: 100vw; height: 100vh');
  rootEl.appendChild(el);
  return el;
}
