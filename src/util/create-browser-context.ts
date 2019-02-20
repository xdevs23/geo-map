import * as Types from '../types';
import { GeoMapWindow } from '../types';

export function createBrowserCtx<T = unknown>(
  y: T = undefined
): Types.BrowserCtx<T> {
  // const x = DOMParser as any;
  return {
    ...y,
    browserCtx: {
      window: window as GeoMapWindow
    }
  };
}
