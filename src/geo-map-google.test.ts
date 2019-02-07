// tslint:disable:no-any
import { GeoMapGoogle } from './geo-map-google';
import * as Test from './test';
import * as Types from './types';
import * as simulant from 'jsdom-simulant';

const auth = {
  clientId: Test.Constants.GOOGLE_MAP_CLIENT_ID,
  channel: Test.Constants.GOOGLE_MAP_CHANNEL
};

test(
  'Google map succeeds loading',
  Test.domContextify(async context => {
    const googleMap = new GeoMapGoogle({
      config: {
        provider: Types.GeoMapProvider.Google,
        auth
      },
      context
    });

    const loadResult = await googleMap.load();
    expect(loadResult.result.type).toBe(Types.ResultType.Success);
  })
);

test(
  'Google respects initial zoom',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { zoom: 2, center: Test.Constants.S2_HAM },
      context
    });
    expect(await googleMap.map.getZoom()).toBe(2);
  })
);

test(
  'Google supports setZoom',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      context
    });
    await googleMap.map.setZoom(1);
    expect(await googleMap.map.getZoom()).toBe(1);
  })
);

test(
  'Google respects initial type',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, type: Types.GeoMapType.Hybrid },
      context
    });
    expect(await googleMap.map.getType()).toBe(Types.GeoMapType.Hybrid);
  })
);

test(
  'Google supports setType',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      context
    });
    googleMap.map.setType(Types.GeoMapType.Hybrid);
    expect(await googleMap.map.getType()).toBe(Types.GeoMapType.Hybrid);
  })
);

test(
  'Google supports initial center',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, zoom: 10 },
      context
    });
    const center = await googleMap.map.getCenter();

    expect(center.lat).toBeCloseTo(Test.Constants.S2_HAM.lat, 4);
    expect(center.lng).toBeCloseTo(Test.Constants.S2_HAM.lng, 4);
  })
);

test(
  'Google map supports setCenter',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      context
    });
    await googleMap.map.setCenter({ lat: 0, lng: 0 });
    expect(await googleMap.map.getCenter()).toEqual({ lat: 0, lng: 0 });
  })
);

test(
  'Google layer default to None',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      context
    });
    expect(await googleMap.map.getLayer()).toBe(Types.GeoLayer.None);
  })
);

test(
  'Google layer respects mount options',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic },
      context
    });
    expect(await googleMap.map.getLayer()).toBe(Types.GeoLayer.Traffic);
  })
);

test(
  'Google layer supports setLayer',
  Test.domContextify(async context => {
    const googleMap = await Test.createGoogleMapImplementation({
      mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic },
      context
    });

    await googleMap.map.setLayer(Types.GeoLayer.Transit);
    expect(await googleMap.map.getLayer()).toBe(Types.GeoLayer.Transit);
  })
);

test(
  'Google fires registered event handlers as expected',
  Test.domContextify(async context => {
    const {
      el,
      map,
      context: ctxWindow
    } = await Test.createGoogleMapImplementation({
      context
    });

    const onClick = jest.fn();
    await map.addEventListener(Types.GeoEvent.Click, onClick);

    const event = simulant(context.window, 'click');
    (event as any).latLng = { lat: () => 0, lng: () => 0 };
    simulant.fire(el, event);

    expect(onClick).toHaveBeenCalledTimes(1);
  })
);

test(
  'Google fires change event handler',
  Test.domContextify(async context => {
    const { map } = await Test.createGoogleMapImplementation({
      context
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
  Test.domContextify(async context => {
    const {
      el,
      map,
      context: ctxWindow
    } = await Test.createGoogleMapImplementation({
      context
    });

    const onClick = jest.fn();
    await map.addEventListener(Types.GeoEvent.Click, onClick);

    const event = simulant(context.window, 'click');
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

test(
  'GeoMapGoogle.coversLocation returns true for location in view bounds',
  Test.domContextify(async context => {
    const { map } = await Test.createGoogleMapImplementation({
      context
    }); // Mock bounds are n: 1, east: -1, south: -1, west: 1
    const covered = await map.coversLocation({ lat: 0, lng: 0 });
    expect(covered).toBe(true);
  })
);

test(
  'GeoMapGoogle.coversLocation false for location outside view bounds',
  Test.domContextify(async context => {
    const { map } = await Test.createGoogleMapImplementation({
      context
    }); // Mock bounds are n: 1, east: -1, south: -1, west: 1
    const covered = await map.coversLocation({ lat: 2, lng: 2 });
    expect(covered).toBe(false);
  })
);
