import * as Constants from './constants';
import * as Types from '../types';
import * as Util from './util';
import { injectBrowserCtx } from './integration-tests-utils';
import { createHereMap } from './create-here-map';
import { createGoogleMap } from './create-google-map';

export const Tests5 = {
  getHere: injectBrowserCtx(async (browserCtx, term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center, zoom: 15 }
    });
    const results = await map.search(term, center);

    if (
      results.type !== Types.ResultType.Success ||
      results.payload.length === 0
    ) {
      return;
    }

    const details = await map.getPlace(results.payload[0].id);

    if (details.type === Types.ResultType.Success) {
      Util.dump(browserCtx, details.payload);
    }
  }),

  getAllWayDownFromReverseGeocode: injectBrowserCtx(async browserCtx => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center, zoom: 15 }
    });
    const geocodeResult = await map.reverseGeocode(center);
    if (
      geocodeResult.type !== Types.ResultType.Success ||
      geocodeResult.payload.length === 0
    ) {
      throw new Error('Expected success from reverse geocode');
    }
    const firstResult = geocodeResult.payload[0];

    const placeResult = await map.getPlace(firstResult.id);
    if (placeResult.type !== Types.ResultType.Success) {
      throw new Error('Expected success from getPlace');
    }
    Util.dump(browserCtx, placeResult.payload);
  }),

  paintGoogleRoute: injectBrowserCtx(async browserCtx => {
    const map = await createGoogleMap({
      config: browserCtx,
      mountInit: { zoom: 8, center: { lat: 53.0572754, lng: 11.4263859 } }
    });

    const result = await map.paintRoute(Constants.S2_HAM, Constants.S2_BER);

    Util.dump(browserCtx, result);
  }),

  paintHereRoute: injectBrowserCtx(async browserCtx => {
    const map = await createHereMap({
      config: browserCtx,
      mountInit: {
        zoom: 8,
        center: { lat: 53.0572754, lng: 11.4263859 }
      }
    });

    const result = await map.paintRoute(Constants.S2_HAM, Constants.S2_BER);

    Util.dump(browserCtx, result);
  })
};
