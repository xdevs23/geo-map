import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import * as GeoMap from '../geo-map';
import * as Types from '../types';
import { DOMContext } from '../types';

export async function createGoogleMap(opts: {
  config: Types.GeoMapConfig;
  mountInit?: Types.GeoMapMountInit;
}): Promise<GeoMap.GeoMap> {
  const provider = Types.GeoMapProvider.Google;

  const googleMap = GeoMap.GeoMap.create({
    config: {
      browserCtx: opts.config.browserCtx,
      provider,
      auth: {
        apiKey: Constants.GOOGLE_MAP_API
        // clientId: Constants.GOOGLE_MAP_CLIENT_ID,
        // channel: Constants.GOOGLE_MAP_CHANNEL
      },
      language: opts.config ? opts.config.language : undefined,
      viewport: opts.config ? opts.config.viewport : undefined
    }
  });

  const el = ensureElement(provider, opts.config.browserCtx);
  await googleMap.mount(el, opts.mountInit || { center: Constants.S2_HAM });
  // console.log('piep');
  await new Promise(rs => setTimeout(rs, 500));
  return googleMap;
}
