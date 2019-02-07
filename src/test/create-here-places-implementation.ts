import { createHMock } from './create-h-mock';
import * as Constants from './constants';
import { ensureElement } from './ensure-element';
import * as Result from '../result';
import * as Types from '../types';
import { GeoMapPlacesServiceHere } from '../geo-map-places-service-here';
import { GeoMapHere } from '../geo-map-here';
import { DOMContext } from '../types';

export async function createHerePlacesImplementation(opts: {
  config?: Partial<Types.LoadHereMapConfig>;
  mount?: Types.GeoMapMountInit;
  mock?: boolean;
  context: DOMContext;
}): Promise<Types.TestServiceImplementation<GeoMapPlacesServiceHere>> {
  try {
    const map = new GeoMapHere({
      config: {
        browserCtx: opts.context,
        provider: Types.GeoMapProvider.Here,
        appCode: Constants.HERE_APP_CODE,
        appId: Constants.HERE_APP_ID,
        language: opts && opts.config ? opts.config.language : undefined,
        viewport: opts && opts.config ? opts.config.viewport : undefined
      },
      geoMapCtx: {
        browserCtx: opts.context,
        load:
          !opts || opts.mock !== false
            ? async () => ({ result: Result.createSuccess(createHMock()) })
            : undefined,
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

    return {
      context: opts.context,
      el,
      service: GeoMapPlacesServiceHere.create({
        context: opts.context,
        api: map.api,
        platform: map.platform
      })
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
