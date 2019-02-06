// tslint:disable

export function createWindow(ctxWindow?: Window): Window {
  const style = 'width: 100%; height: 100%';
  if (ctxWindow) {
    window.document.children[0].id = 'root';
    window.document.children[0].setAttribute('style', style);
    return window;
  }

  if (window.name !== 'nodejs') {
    return window;
  }

  const JSDOM = require('jsdom').JSDOM;
  const jestCanvasMock = require('jest-canvas-mock/lib/window').default;
  return jestCanvasMock(
    new JSDOM(`<div id="root" style="${style}"></div>`, {
      resources: 'usable',
      runScripts: 'dangerously'
    }).window
  );
}
