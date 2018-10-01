import * as Types from '../types';

export function ensureElement(provider: Types.GeoMapProvider, { window }: { window: Window } = { window }): HTMLDivElement {
  const rootEl = window.document.getElementById('root') as HTMLElement;
  const previous = window.document.querySelector(`[data-map="${provider}"]`);

  if (previous && previous.parentElement) {
    previous.parentElement.removeChild(previous);
  }

  const el = window.document.createElement('div');
  el.setAttribute('data-map', provider);
  rootEl.appendChild(el);
  return el;
}
