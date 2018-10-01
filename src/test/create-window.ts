// tslint:disable

export function createWindow(): Window {
  if (window.name !== 'nodejs') {
    return window;
  }

  const JSDOM = require('jsdom').JSDOM;
  const jestCanvasMock = require('jest-canvas-mock/lib/window').default;
  return jestCanvasMock(new JSDOM('<div id="root" style="width: 100%; height: 100%"></div>', { resources: 'usable', runScripts: 'dangerously' }).window);
}
