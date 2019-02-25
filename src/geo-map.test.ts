import { GeoMap } from './geo-map';
import * as Test from './test';
import * as Types from './types';
// import { browserCtxify } from './test';

const auth = {
  clientId: Test.Constants.GOOGLE_MAP_CLIENT_ID,
  channel: Test.Constants.GOOGLE_MAP_CHANNEL
};

test(
  'Google geo map exposes expected provider',
  Test.domContextify(async browserCtx => {
    const googleMap = GeoMap.create({
      config: {
        browserCtx,
        provider: Types.GeoMapProvider.Google,
        auth
      }
    });

    expect(googleMap.provider).toBe(Types.GeoMapProvider.Google);
  })
);

test(
  'HERE geo map exposes expected provider',
  Test.domContextify(async browserCtx => {
    const googleMap = GeoMap.create({
      config: {
        browserCtx,
        provider: Types.GeoMapProvider.Here,
        appCode: Test.Constants.HERE_APP_CODE,
        appId: Test.Constants.HERE_APP_ID
      }
    });

    expect(googleMap.provider).toBe(Types.GeoMapProvider.Here);
  })
);

test(
  'faulty geo map fails loading',
  Test.domContextify(async browserCtx => {
    const faultyMap = GeoMap.create({
      config: {
        browserCtx,
        provider: 'Algolia' as Types.GeoMapProvider.Here,
        appCode: Test.Constants.HERE_APP_CODE,
        appId: Test.Constants.HERE_APP_ID
      }
    });

    const loadResult = await faultyMap.load();
    expect(loadResult.result.type).toBe(Types.ResultType.Failure);
  })
);

// TODO: Check if we can reestablish support in JSDOM
// currently fails with "The Google Maps JavaScript API does not support this browser".
test(
  'Google geo map loads automatically when mounting',
  Test.domContextify(async domCtx => {
    const loaded = jest.fn();

    const googleMap = GeoMap.create({
      config: {
        browserCtx: domCtx,
        provider: Types.GeoMapProvider.Google,
        auth
      },
      geoMapCtx: {
        loaded
      }
    });

    const el = Test.ensureElement(Types.GeoMapProvider.Google, domCtx);
    await googleMap.mount(el, { center: Test.Constants.S2_HAM });

    expect(loaded).toHaveBeenCalledTimes(1);
  })
);

test(
  'HERE geo map loads automatically when mounting',
  Test.domContextify(async browserCtx => {
    const loaded = jest.fn();

    const hereMap = GeoMap.create({
      config: {
        browserCtx,
        provider: Types.GeoMapProvider.Here,
        appCode: Test.Constants.HERE_APP_CODE,
        appId: Test.Constants.HERE_APP_ID
      },
      geoMapCtx: {
        changed: async () => {
          /** */
        },
        init: () => Test.createHMock(),
        loaded
      }
    });

    const el = Test.ensureElement(Types.GeoMapProvider.Here, browserCtx);
    await hereMap.mount(el, { center: Test.Constants.S2_HAM });

    expect(loaded).toHaveBeenCalledTimes(1);
  })
);

test(
  'Geo map exposes getLayer',
  Test.domContextify(async domContext => {
    const el = Test.ensureElement(Types.GeoMapProvider.Custom, domContext);
    const expected = Types.GeoLayer.Traffic;

    const mock = await Test.createMockMapImplementation(
      {
        getLayer: jest.fn().mockImplementation(() => expected)
      },
      domContext
    );

    const map = GeoMap.from(mock);
    await map.mount(el, { center: Test.Constants.S2_HAM });

    expect(await map.getLayer()).toBe(expected);
    expect(mock.getLayer).toHaveBeenCalledTimes(1);
  })
);

test(
  'Geo map exposes setLayer',
  Test.domContextify(async context => {
    const el = Test.ensureElement(Types.GeoMapProvider.Custom, context);
    const expected = Types.GeoLayer.Transit;

    const mock = await Test.createMockMapImplementation(
      { setLayer: jest.fn() },
      context
    );

    const map = GeoMap.from(mock);
    await map.mount(el, { center: Test.Constants.S2_HAM });
    await map.setLayer(expected);

    expect(mock.setLayer).toHaveBeenCalledWith(expected);
  })
);
