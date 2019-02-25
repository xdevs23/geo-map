import { GeoMapGoogle } from './geo-map-google';
import * as Test from './test';
import * as Types from './types';
import * as simulant from 'jsdom-simulant';
import { LoadGoogleMapConfig } from './types';

const auth = {
  clientId: Test.Constants.GOOGLE_MAP_CLIENT_ID,
  channel: Test.Constants.GOOGLE_MAP_CHANNEL
};

test(
  'Google map succeeds loading',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = new GeoMapGoogle({
      config: {
        ...browserCtx,
        provider: Types.GeoMapProvider.Google,
        auth
      }
    });

    const loadResult = await googleMap.load();
    expect(loadResult.result.type).toBe(Types.ResultType.Success);
  })
);

test(
  'Google respects initial zoom',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { zoom: 2, center: Test.Constants.S2_HAM },
      config: browserCtx
    });
    expect(await googleMap.map.getZoom()).toBe(2);
  })
);

test(
  'Google supports setZoom',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      config: browserCtx
    });
    await googleMap.map.setZoom(1);
    expect(await googleMap.map.getZoom()).toBe(1);
  })
);

test(
  'Google respects initial type',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, type: Types.GeoMapType.Hybrid },
      config: browserCtx
    });
    expect(await googleMap.map.getType()).toBe(Types.GeoMapType.Hybrid);
  })
);

test(
  'Google supports setType',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      config: browserCtx
    });
    googleMap.map.setType(Types.GeoMapType.Hybrid);
    expect(await googleMap.map.getType()).toBe(Types.GeoMapType.Hybrid);
  })
);

test(
  'Google supports initial center',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, zoom: 10 },
      config: browserCtx
    });
    const center = await googleMap.map.getCenter();

    expect(center.lat).toBeCloseTo(Test.Constants.S2_HAM.lat, 4);
    expect(center.lng).toBeCloseTo(Test.Constants.S2_HAM.lng, 4);
  })
);

test(
  'Google map supports setCenter',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      config: browserCtx
    });
    await googleMap.map.setCenter({ lat: 0, lng: 0 });
    expect(await googleMap.map.getCenter()).toEqual({ lat: 0, lng: 0 });
  })
);

test(
  'Google layer default to None',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      config: browserCtx
    });
    expect(await googleMap.map.getLayer()).toBe(Types.GeoLayer.None);
  })
);

test(
  'Google layer respects mount options',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic },
      config: browserCtx
    });
    expect(await googleMap.map.getLayer()).toBe(Types.GeoLayer.Traffic);
  })
);

test(
  'Google layer supports setLayer',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic },
      config: browserCtx
    });

    await googleMap.map.setLayer(Types.GeoLayer.Transit);
    expect(await googleMap.map.getLayer()).toBe(Types.GeoLayer.Transit);
  })
);

test(
  'Google fires registered event handlers as expected',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    // debugger;
    const { el, map } = await Test.createGoogleMapImplementation({
      config: browserCtx
    });
    // await map.load();

    const onClick = jest.fn();
    // await map.addEventListener(Types.GeoEvent.Click, onClick);
    await map.addEventListener(Types.GeoEvent.Click, onClick);

    //browserCtx.browserCtx.window.addEventListener('click', onClick);
    // el.addEventListener('click', onClick);

    const event = simulant(browserCtx.browserCtx.window, 'click');
    (event as any).latLng = {
      latLng: { lat: () => 0, lng: () => 0 }
    };
    const fn = jest.fn();
    el.addEventListener('click', fn);
    const fn1 = jest.fn();
    browserCtx.browserCtx.window.addEventListener('click', fn1);
    simulant.fire(el, event);

    // console.log('PIEP:', event, 'fn=', fn.mock.calls, 'fn1=', fn1.mock.calls, browserCtx.browserCtx.window.document.documentElement.outerHTML);

    return new Promise(rs => {
      setTimeout(() => {
        expect(onClick).toHaveBeenCalledTimes(1);
        rs();
      }, 100);
    });
  })
);

test(
  'Google fires change event handler',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const { map } = await Test.createGoogleMapImplementation({
      config: browserCtx
    });

    const onChange = jest.fn();
    await map.addEventListener(Types.GeoEvent.Changed, onChange);
    expect(onChange).not.toHaveBeenCalled();

    await map.setCenter(Test.Constants.S2_HAM);
    expect(onChange).toHaveBeenCalled();

    await map.setZoom(10);
    expect(onChange).toHaveBeenCalledTimes(2);
  })
);

test(
  'Google click carries lat/lng payload',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const { el, map } = await Test.createGoogleMapImplementation({
      config: browserCtx
    });

    const onClick = jest.fn();
    await map.addEventListener(Types.GeoEvent.Click, onClick);

    const event = simulant(browserCtx.browserCtx.window, 'click');
    (event as any).latLng = { lat: () => 0, lng: () => 0 };
    simulant.fire(el, event);

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        position: {
          lat: 0,
          lng: 0
        }
      })
    );
  })
);

test.only(
  'GeoMapGoogle.coversLocation returns true for location in view bounds',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const { map } = await Test.createGoogleMapImplementation({
      config: browserCtx,
      mock: true
    }); // Mock bounds are n: 1, east: -1, south: -1, west: 1
    const bounds = await map.getViewBounds();
    const hamBox = {
      north: bounds.north + 1,
      west: bounds.west - 1,
      south: bounds.south - 1,
      east: bounds.east + 1
    };
    // debugger;
    await map.setViewBounds(hamBox);
    return new Promise(rs => {
      setTimeout(async () => {
        const lo = await map.getViewBounds();
        console.log(bounds, hamBox, lo);
        const covered = await map.coversLocation({ lat: 0, lng: 0 });
        expect(covered).toBe(true);
      }, 100);
    });
  })
);

test.only(
  'GeoMapGoogle.coversLocation false for location outside view bounds',
  Test.browserCtxify<LoadGoogleMapConfig>(async browserCtx => {
    const { map } = await Test.createGoogleMapImplementation({
      config: browserCtx,
      mock: true
    }); // Mock bounds are n: 1, east: -1, south: -1, west: 1
    console.log('bound:', await map.getViewBounds());
    const covered = await map.coversLocation({ lat: 2, lng: 2 });
    expect(covered).toBe(false);
  })
);
