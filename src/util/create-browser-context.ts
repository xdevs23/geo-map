import * as Types from '../types';

export function createBrowserCtx<T = unknown>(
  y: T = undefined
): Types.BrowserCtx<T> {
  const x = DOMParser as any;
  return {
    ...y,
    browserCtx: {
      window: {
        ...window,
        google
      },
      global: {
        DOMParser: x
      }
    }
  };
}
