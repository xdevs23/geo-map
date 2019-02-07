import { createHMock } from './create-h-mock';
import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import * as GeoMap from '../geo-map';
import * as Types from '../types';
import { DOMContext } from '../types';

export async function createHereMap(opts: {
  config?: Partial<Types.GeoMapConfig>;
  mountInit?: Types.GeoMapMountInit;
  context: DOMContext;
}): Promise<GeoMap.GeoMap> {
  const myWindow = opts.context;
  const provider = Types.GeoMapProvider.Here;

  const hereMap = GeoMap.GeoMap.create({
    config: {
      provider,
      appCode: Constants.HERE_APP_CODE,
      appId: Constants.HERE_APP_ID,
      language: opts && opts.config ? opts.config.language : undefined,
      viewport: opts && opts.config ? opts.config.viewport : undefined
    },
    context: {
      ...opts.context
    }
  });

  const el = ensureElement(provider, opts.context);
  await hereMap.mount(
    el,
    (opts && opts.mountInit) || { center: Constants.S2_HAM }
  );
  return hereMap;
}
