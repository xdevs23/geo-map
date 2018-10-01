import { createWindow } from './create-window';
import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import * as GeoMap from '../geo-map';
import * as Types from '../types';

export async function createGoogleMap(config?: Partial<Types.GeoMapConfig>, mountInit?: Types.GeoMapMountInit): Promise<GeoMap.GeoMap> {
  const window = createWindow();
  const provider = Types.GeoMapProvider.Google;

  const googleMap = GeoMap.GeoMap.create({
    config: {
      provider,
      auth: {
        apiKey: Constants.GOOGLE_MAP_API,
        // clientId: Constants.GOOGLE_MAP_CLIENT_ID,
        // channel: Constants.GOOGLE_MAP_CHANNEL
      },
      language: config ? config.language : undefined,
      viewport: config ? config.viewport : undefined
    },
    context: window.name === 'nodejs' ? {
      window,
      loaded: async () => { /** */ }
    } : undefined
  });

  const el = ensureElement(provider, { window });
  await googleMap.mount(el, mountInit || { center: Constants.S2_HAM });
  return googleMap;
}
