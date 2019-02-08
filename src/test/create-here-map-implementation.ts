import { createHMock } from './create-h-mock';
import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import { GeoMapHere } from '../geo-map-here';
import * as Types from '../types';
import { DOMContext } from '../types';

export async function createHereMapImplementation(opts: {
  config: Types.LoadHereMapConfig;
  mount?: Types.GeoMapMountInit;
}): Promise<Types.TestMapImplementation<GeoMapHere>> {
  try {
    const map = new GeoMapHere({
      config: {
        browserCtx: opts.config.browserCtx,
        provider: Types.GeoMapProvider.Here,
        appCode: Constants.HERE_APP_CODE,
        appId: Constants.HERE_APP_ID,
        language: opts && opts.config ? opts.config.language : undefined,
        viewport: opts && opts.config ? opts.config.viewport : undefined
      }
    });

    const el = ensureElement(Types.GeoMapProvider.Here, opts.config.browserCtx);

    await map.load();
    await map.mount(el, {
      center: Constants.S2_HAM,
      ...((opts && opts.mount) || {})
    });
    return { context: opts.config.browserCtx, map, el };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
