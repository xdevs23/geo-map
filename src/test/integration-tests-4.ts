import * as Constants from './constants';
import * as Types from '../types';
import * as Util from './util';
import { injectBrowserCtx } from './integration-tests-utils';
import { createHereMap } from './create-here-map';
import { createGoogleMap } from './create-google-map';

export const Tests4 = {
  layerGoogle: injectBrowserCtx(
    async (browserCtx, layer: Types.GeoLayer = Types.GeoLayer.None) => {
      const googleMap = await createGoogleMap({
        config: browserCtx,
        mountInit: { center: Constants.S2_HAM, zoom: 13, layer }
      });
      await googleMap.phase(Types.GeoMapPhase.Layouted);
    }
  ),

  layerHere: injectBrowserCtx(
    async (browserCtx, layer: Types.GeoLayer = Types.GeoLayer.None) => {
      return createHereMap({
        config: browserCtx,
        mountInit: { center: Constants.S2_HAM, zoom: 13, layer }
      });
    }
  ),

  circleGoogle: injectBrowserCtx(async browserCtx => {
    const map = await createGoogleMap({
      config: browserCtx,
      mountInit: { center: Constants.S2_HAM, zoom: 13 }
    });
    map.createGeoCircle({ position: Constants.S2_HAM, radius: 100 });
  }),

  circleHere: injectBrowserCtx(async browserCtx => {
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center: Constants.S2_HAM, zoom: 13 }
    });
    map.createGeoCircle({ position: Constants.S2_HAM, radius: 100 });
  }),

  eventGoogle: injectBrowserCtx(async (browserCtx, id: string) => {
    const data = { clicked: 0 };
    const map = await createGoogleMap({
      config: browserCtx,
      mountInit: { center: Constants.S2_HAM, zoom: 13 }
    });

    map.addEventListener(Types.GeoEvent.Click, () => {
      data.clicked++;
      Util.dump(browserCtx, data);
    });
  }),

  eventHere: injectBrowserCtx(async (browserCtx, id: string) => {
    const data = { clicked: 0 };
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center: Constants.S2_HAM, zoom: 13 }
    });

    map.addEventListener(Types.GeoEvent.Click, () => {
      data.clicked++;
      Util.dump(browserCtx, data);
    });
  }),

  eventPayloadGoogle: injectBrowserCtx(
    async (browserCtx, input?: { lat: number; lng: number }) => {
      const center = input || { lat: 1, lng: 1 };
      const map = await createGoogleMap({
        config: browserCtx,
        mountInit: { center, zoom: 13 }
      });
      map.addEventListener(Types.GeoEvent.Click, e => Util.dump(browserCtx, e));
    }
  ),

  eventPayloadHere: injectBrowserCtx(
    async (browserCtx, input?: { lat: number; lng: number }) => {
      const center = input || { lat: 1, lng: 1 };
      const map = await createHereMap({
        config: browserCtx,
        mountInit: { center, zoom: 13 }
      });
      map.addEventListener(Types.GeoEvent.Click, e => Util.dump(browserCtx, e));
    }
  ),

  geocodeHere: injectBrowserCtx(
    async (
      browserCtx,
      center: { lat: number; lng: number } = Constants.S2_FRA
    ) => {
      const map = await createHereMap({
        config: browserCtx,
        mountInit: { center, zoom: 17 }
      });
      map.addEventListener(Types.GeoEvent.Click, async e => {
        if (!e) {
          return;
        }

        const results = await map.reverseGeocode(e.position);

        if (results.type === Types.ResultType.Success) {
          Util.dump(browserCtx, results.payload[0]);
        }
      });
    }
  ),

  geocodeGoogle: injectBrowserCtx(
    async (
      browserCtx,
      center: { lat: number; lng: number } = Constants.S2_FRA
    ) => {
      const map = await createGoogleMap({
        config: browserCtx,
        mountInit: { center, zoom: 17 }
      });
      map.addEventListener(Types.GeoEvent.Click, async e => {
        if (!e) {
          return;
        }

        const result = await map.reverseGeocode(e.position);

        if (result.type === Types.ResultType.Success) {
          Util.dump(browserCtx, result.payload[0]);
        }
      });
    }
  ),

  searchHere: injectBrowserCtx(async (browserCtx, term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center, zoom: 15 }
    });
    const results = await map.search(term, center);

    if (results.type === Types.ResultType.Success) {
      Util.dump(browserCtx, results.payload);
    }
  }),

  searchGoogle: injectBrowserCtx(
    async (browserCtx, term: string = 'Hamburg') => {
      const center = Constants.S2_HAM;
      const map = await createGoogleMap({
        config: browserCtx,
        mountInit: { center, zoom: 15 }
      });
      const results = await map.search(term, center);

      if (results.type === Types.ResultType.Success) {
        Util.dump(browserCtx, results.payload);
      }
    }
  ),

  getGoogle: injectBrowserCtx(async (browserCtx, term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createGoogleMap({
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
  })
};
