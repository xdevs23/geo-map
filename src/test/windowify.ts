import { DOMContext, GeoMapWindow, BrowserCtx } from '../types';

const JSDOMEnvironment = require('jest-environment-jsdom');

export function domContextify<T>(
  injected: (context: DOMContext) => Promise<T | void>
): jest.ProvidesCallback {
  // (jsdomEnv.dom.window as Window).document.body.setAttribute('id', 'root');
  // (global as any).window = jsdomEnv.dom.window;
  // console.log('JSDOM Created', typeof jsdomEnv.dom.window, typeof window);
  return async done => {
    debugger;
    console.log('domContextify');
    const jsdomEnv = new JSDOMEnvironment(
      {
        testEnvironmentOptions: {
          resources: 'usable'
        }
      },
      {
        /* */
      }
    );
    try {
      // (global as any).window = jsdomEnv.dom.window;
      // (global as any).document = jsdomEnv.dom.window.document;
      await jsdomEnv.setup();
      await injected({
        window: jsdomEnv.dom.window
        // global: jsdomEnv.global
      });
      done();
    } catch (e) {
      done(e);
    } finally {
      jsdomEnv.dom.window.close();
      jsdomEnv.teardown();
    }
  };
}

export function browserCtxify<T extends BrowserCtx>(
  injected: (browserCtx: BrowserCtx<T>) => Promise<BrowserCtx<T> | void>
): jest.ProvidesCallback {
  return domContextify(ctx => injected({ browserCtx: ctx } as T));
}

export function windowify<T>(
  injected: (window: GeoMapWindow) => Promise<T | void>
): jest.ProvidesCallback {
  return domContextify(ctx => injected(ctx.window));
}
