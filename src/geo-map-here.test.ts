// tslint:disable:no-any
import { GeoMapHere } from './geo-map-here';
import * as Test from './test';
import * as Types from './types';
import { LoadHereMapConfig } from './types';

const simulant = require('jsdom-simulant');

test(
  'HERE geo map succeeds loading',
  Test.domContextify(async context => {
    const myWindow = window;

    const hereMap = new GeoMapHere({
      config: {
        browserCtx: context,
        provider: Types.GeoMapProvider.Here,
        appCode: Test.Constants.HERE_APP_CODE,
        appId: Test.Constants.HERE_APP_ID
      },
      geoMapCtx: {
        changed: async () => {
          /** */
        },
        init: () => Test.createHMock(),
        loaded: async () => {
          /** */
        }
      }
    });

    const loadResult = await hereMap.load();
    expect(loadResult.result.type).toBe(Types.ResultType.Success);
  })
);

test(
  'HERE map respects initial zoom',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      config: context,
      mount: { zoom: 2, center: Test.Constants.S2_HAM }
    });
    expect(await hereMap.map.getZoom()).toBe(2);
  })
);

test(
  'HERE map supports setZoom',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      config: context
    });
    await hereMap.map.setZoom(1);
    expect(await hereMap.map.getZoom()).toBe(1);
  })
);

test(
  'HERE map supports setType',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      config: context
    });
    await hereMap.map.setType(Types.GeoMapType.Hybrid);
    expect(await hereMap.map.getType()).toBe(Types.GeoMapType.Hybrid);
  })
);

test(
  'HERE map supports setCenter',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      config: context
    });
    await hereMap.map.setCenter({ lat: 0, lng: 0 });
    expect(await hereMap.map.getCenter()).toEqual({ lat: 0, lng: 0 });
  })
);

test(
  'HERE layer default to None',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      config: context
    });
    expect(await hereMap.map.getLayer()).toBe(Types.GeoLayer.None);
  })
);

test(
  'HERE layer respects mount options',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic },
      config: context
    });
    expect(await hereMap.map.getLayer()).toBe(Types.GeoLayer.Traffic);
  })
);

test(
  'HERE layer supports setLayer',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const hereMap = await Test.createHereMapImplementation({
      mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic },
      config: context
    });

    await hereMap.map.setLayer(Types.GeoLayer.Transit);
    expect(await hereMap.map.getLayer()).toBe(Types.GeoLayer.Transit);
  })
);

test(
  'HERE fires registered event handlers',
  Test.browserCtxify<Types.LoadHereMapConfig>(async browserContext => {
    const { el, map, browserCtx } = await Test.createHereMapImplementation({
      config: browserContext
    });

    const onClick = jest.fn();
    await map.addEventListener(Types.GeoEvent.Click, onClick);

    const event = simulant(browserCtx.window, 'click');
    (event as any).currentPointer = { viewportX: 0, viewporty: 0 };

    simulant.fire(el, event);

    expect(onClick).toHaveBeenCalledTimes(1);
  })
);

test(
  'HERE fires change event handler for setCenter',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const { map } = await Test.createHereMapImplementation({
      config: context
    });

    const onChange = jest.fn();
    await map.addEventListener(Types.GeoEvent.Changed, onChange);
    expect(onChange).not.toHaveBeenCalled();

    await map.setCenter(Test.Constants.S2_HAM);
    expect(onChange).toHaveBeenCalled();
  })
);

test(
  'HERE fires change event handler for setZoom',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const { map } = await Test.createHereMapImplementation({
      config: context
    });

    const onChange = jest.fn();
    await map.addEventListener(Types.GeoEvent.Changed, onChange);
    expect(onChange).not.toHaveBeenCalled();

    await map.setZoom(10);
    expect(onChange).toHaveBeenCalled();
  })
);

test(
  'HERE fires change event handler for setType',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const { map } = await Test.createHereMapImplementation({
      config: context
    });

    const onChange = jest.fn();
    await map.addEventListener(Types.GeoEvent.Changed, onChange);
    expect(onChange).not.toHaveBeenCalled();

    await map.setType(Types.GeoMapType.Roadmap);
    expect(onChange).toHaveBeenCalledTimes(1);
  })
);

test(
  'HERE click carries lat/lng payload',
  Test.browserCtxify<LoadHereMapConfig>(async context => {
    const { el, map, browserCtx } = await Test.createHereMapImplementation({
      config: context
    });

    const onClick = jest.fn();
    await map.addEventListener(Types.GeoEvent.Click, onClick);

    const event = simulant(browserCtx.window, 'click');
    (event as any).currentPointer = { viewportX: 0, viewportY: 0 };

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
  'GeoMapHere.coversLocation returns true for location in view bounds',
  Test.browserCtxify<LoadHereMapConfig>(async context => {
    const { map } = await Test.createHereMapImplementation({
      config: context
    }); // Mock bounds are n: 1, east: -1, south: -1, west: 1
    const covered = await map.coversLocation({ lat: 0, lng: 0 });
    expect(covered).toBe(true);
  })
);

test(
  'GeoMapHere.coversLocation returns false for location outside view bounds',
  Test.browserCtxify<Types.LoadHereMapConfig>(async context => {
    const { map } = await Test.createHereMapImplementation({
      config: context
    }); // Mock bounds are n: 1, east: -1, south: -1, west: 1
    const covered = await map.coversLocation({ lat: 2, lng: 2 });
    expect(covered).toBe(false);
  })
);
