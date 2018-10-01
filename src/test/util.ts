// tslint:disable:no-require-imports
// tslint:disable:no-var-requires
import * as Util from 'util';
import * as Types from '../types';

const PNGReader = require('png.js');

// tslint:disable-next-line:no-any
export const div = (fragments: TemplateStringsArray, ...interpolations: any[]) => {
  const parts = fragments.reduce((result, part, i) => [...result, part, interpolations[i]], []);

  const el = document.createElement('div');

  el.setAttribute('style', parts
    .join('')
    .split('\n')
    .join('')
    .split(';')
    .map((i) => i.trim())
    .join('; '));

  return el;
};

export const parsePng = (image: Buffer) => {
  const reader = new PNGReader(image);
  return Util.promisify(reader.parse.bind(reader))();
};

export function paintViewport({ container, viewport }:
  { container: HTMLElement; viewport: Types.GeoMapViewport } ): void {
  const els = [];

  if (viewport.top > 0) {
    els.push(div`
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      left: 0;
      background: red;
      height: ${viewport.top}px;
  `);
  }

  if (viewport.right > 0) {
    els.push(div`
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      bottom: 0;
      background: red;
      width: ${viewport.right}px;
  `);
  }

  if (viewport.bottom > 0) {
    els.push(div`
      position: absolute;
      z-index: 1;
      right: 0;
      bottom: 0;
      left: 0;
      background: red;
      height: ${viewport.bottom}px;
  `);
  }

  if (viewport.left > 0) {
    els.push(div`
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      background: red;
      width: ${viewport.left}px;
  `);
  }

  els.forEach((el) => container.appendChild(el));
}

// tslint:disable-next-line:no-any
export function dump(data: any): void {
  const previous = document.querySelector('textarea[data-dump]');
  const el = (previous || document.createElement('textarea')) as HTMLElement;
  el.setAttribute('data-dump', 'data-dump');
  el.textContent = JSON.stringify(data);

  if (!previous) {
    document.body.appendChild(el);
  }
}
