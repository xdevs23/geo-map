import * as Types from '../types';

export function createDOMContext(): Types.DOMContext {
  const x = DOMParser as any;
  return {
    window,
    global: {
      DOMParser: x
    }
  };
}
