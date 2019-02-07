import { createGoogleMock } from './create-google-mock';
import * as Constants from './constants';
import { ensureElement } from './ensure-element';
import { GeoMapPlacesServiceGoogle } from '../geo-map-places-service-google';
import * as Result from '../result';
import * as Types from '../types';
import { GeoMapGoogle } from '../geo-map-google';
import { DOMContext } from '../types';

export async function createGooglePlacesImplementation(opts: {
  config?: Partial<Types.LoadGoogleMapConfig>;
  mount?: Types.GeoMapMountInit;
  mock?: boolean;
  context: DOMContext;
}): Promise<Types.TestServiceImplementation<GeoMapPlacesServiceGoogle>> {
  try {
    const map = new GeoMapGoogle({
      config: {
        browserCtx: opts.context,
        provider: Types.GeoMapProvider.Google,
        auth: {
          apiKey: Constants.GOOGLE_MAP_API,
          clientId: Constants.GOOGLE_MAP_CLIENT_ID,
          channel: Constants.GOOGLE_MAP_CHANNEL
        },
        mapJsUrl: opts && opts.config ? opts.config.mapJsUrl : undefined,
        mapJsCallbackId:
          opts && opts.config ? opts.config.mapJsCallbackId : undefined,
        language: opts && opts.config ? opts.config.language : undefined,
        viewport: opts && opts.config ? opts.config.viewport : undefined
      },
      geoMapCtx: {
        browserCtx: opts.context,
        load:
          !opts || opts.mock !== false
            ? async () => ({ result: Result.createSuccess(createGoogleMock()) })
            : undefined,
        loaded: async () => {
          /** */
        }
      }
    });

    const el = ensureElement(Types.GeoMapProvider.Google, opts.context);

    await map.load();
    await map.mount(el, {
      center: Constants.S2_HAM,
      ...((opts && opts.mount) || {})
    });

    return {
      context: opts.context,
      el,
      service: GeoMapPlacesServiceGoogle.create({
        api: map.api,
        context: opts.context
      })
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
