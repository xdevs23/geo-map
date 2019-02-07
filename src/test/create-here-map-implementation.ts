import { createHMock } from './create-h-mock';
import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import { GeoMapHere } from '../geo-map-here';
import * as Types from '../types';
import { DOMContext } from '../types';

export async function createHereMapImplementation(opts: {
  config?: Partial<Types.LoadHereMapConfig>;
  mount?: Types.GeoMapMountInit;
  context: DOMContext;
}): Promise<Types.TestMapImplementation<GeoMapHere>> {
  try {
    const ctxWindow = opts.context;

    const map = new GeoMapHere({
      config: {
        provider: Types.GeoMapProvider.Here,
        appCode: Constants.HERE_APP_CODE,
        appId: Constants.HERE_APP_ID,
        language: opts && opts.config ? opts.config.language : undefined,
        viewport: opts && opts.config ? opts.config.viewport : undefined
      },
      context: {
        ...opts.context,
        changed: async () => {
          /** */
        },
        init: () => createHMock(),
        loaded: async () => {
          /** */
        }
      }
    });

    const el = ensureElement(Types.GeoMapProvider.Here, opts.context);

    await map.load();
    await map.mount(el, {
      center: Constants.S2_HAM,
      ...((opts && opts.mount) || {})
    });
    return { context: opts.context, map, el };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
