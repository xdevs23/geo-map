import { DOMContext } from '../types';

const JSDOMEnvironment = require('jest-environment-jsdom');

export function domContextify<T>(
  toInject: (context: DOMContext) => Promise<T>
): jest.ProvidesCallback {
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
  // (jsdomEnv.dom.window as Window).document.body.setAttribute('id', 'root');
  // (global as any).window = jsdomEnv.dom.window;
  // console.log('JSDOM Created', typeof jsdomEnv.dom.window, typeof window);
  return async done => {
    try {
      await toInject({
        window: jsdomEnv.dom.window,
        global: jsdomEnv.global
      });
      done();
    } catch (e) {
      done(e);
    } finally {
      jsdomEnv.dom.window.close();
    }
  };
}

export function windowify<T>(
  toInject: (window: Window) => Promise<T>
): jest.ProvidesCallback {
  return domContextify(ctx => toInject(ctx.window));
}
