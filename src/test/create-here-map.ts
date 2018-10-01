import { createHMock } from './create-h-mock';
import { createWindow } from './create-window';
import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import * as GeoMap from '../geo-map';
import * as Types from '../types';

export async function createHereMap(config?: Partial<Types.GeoMapConfig>, mountInit?: Types.GeoMapMountInit): Promise<GeoMap.GeoMap> {
  const window = createWindow();
  const provider = Types.GeoMapProvider.Here;

  const hereMap = GeoMap.GeoMap.create({
    config: {
      provider,
      appCode: Constants.HERE_APP_CODE,
      appId: Constants.HERE_APP_ID,
      language: config ? config.language : undefined,
      viewport: config ? config.viewport : undefined
    },
    context: window.name === 'nodejs' ? {
      window,
      changed: async () => { /** */ },
      init: () => createHMock(),
      loaded: async () => { /** */ }
    } : undefined
  });

  const el = ensureElement(provider, { window });
  await hereMap.mount(el, mountInit || { center: Constants.S2_HAM });
  return hereMap;
}
