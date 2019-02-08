import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import * as GeoMap from '../geo-map';
import * as Types from '../types';

export async function createHereMap(opts: {
  config: Types.GeoMapConfig;
  mountInit?: Types.GeoMapMountInit;
}): Promise<GeoMap.GeoMap> {
  const provider = Types.GeoMapProvider.Here;

  const hereMap = GeoMap.GeoMap.create({
    config: {
      browserCtx: opts.config.browserCtx,
      provider,
      appCode: Constants.HERE_APP_CODE,
      appId: Constants.HERE_APP_ID,
      language: opts && opts.config ? opts.config.language : undefined,
      viewport: opts && opts.config ? opts.config.viewport : undefined
    }
  });

  const el = ensureElement(provider, opts.config.browserCtx);
  await hereMap.mount(
    el,
    (opts && opts.mountInit) || { center: Constants.S2_HAM }
  );
  return hereMap;
}
