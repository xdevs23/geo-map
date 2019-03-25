// tslint:disable:no-any
import { GeoMapHere } from './geo-map-here';
import * as Test from './test';
import * as Types from './types';

const simulant = require('jsdom-simulant');

test('HERE geo map succeeds loading', async () => {
  const window = Test.createWindow();

  const hereMap = new GeoMapHere({
    config: {
      provider: Types.GeoMapProvider.Here,
      appCode: Test.Constants.HERE_APP_CODE,
      appId: Test.Constants.HERE_APP_ID
    },
    context: {
      window,
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
});

test('HERE map respects initial zoom', async () => {
  const hereMap = await Test.createHereMapImplementation({
    mount: { zoom: 2, center: Test.Constants.S2_HAM }
  });
  expect(await hereMap.map.getZoom()).toBe(2);
});

test('HERE map supports setZoom', async () => {
  const hereMap = await Test.createHereMapImplementation();
  await hereMap.map.setZoom(1);
  expect(await hereMap.map.getZoom()).toBe(1);
});

test('HERE map supports setType', async () => {
  const hereMap = await Test.createHereMapImplementation();
  await hereMap.map.setType(Types.GeoMapType.Hybrid);
  expect(await hereMap.map.getType()).toBe(Types.GeoMapType.Hybrid);
});

test('HERE map supports setCenter', async () => {
  const hereMap = await Test.createHereMapImplementation();
  await hereMap.map.setCenter({ lat: 0, lng: 0 });
  expect(await hereMap.map.getCenter()).toEqual({ lat: 0, lng: 0 });
});

test('HERE layer default to None', async () => {
  const hereMap = await Test.createHereMapImplementation();
  expect(await hereMap.map.getLayer()).toBe(Types.GeoLayer.None);
});

test('HERE layer respects mount options', async () => {
  const hereMap = await Test.createHereMapImplementation({
    mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic }
  });
  expect(await hereMap.map.getLayer()).toBe(Types.GeoLayer.Traffic);
});

test('HERE layer supports setLayer', async () => {
  const hereMap = await Test.createHereMapImplementation({
    mount: { center: Test.Constants.S2_HAM, layer: Types.GeoLayer.Traffic }
  });

  await hereMap.map.setLayer(Types.GeoLayer.Transit);
  expect(await hereMap.map.getLayer()).toBe(Types.GeoLayer.Transit);
});

test('HERE fires registered event handlers', async () => {
  const { el, map, window } = await Test.createHereMapImplementation();

  const onClick = jest.fn();
  await map.addEventListener(Types.GeoEvent.Click, onClick);

  const event = simulant(window, 'click');
  (event as any).currentPointer = { viewportX: 0, viewporty: 0 };

  simulant.fire(el, event);

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('HERE fires change event handler for setCenter', async () => {
  const { map } = await Test.createHereMapImplementation();

  const onChange = jest.fn();
  await map.addEventListener(Types.GeoEvent.Changed, onChange);
  expect(onChange).not.toHaveBeenCalled();

  await map.setCenter(Test.Constants.S2_HAM);
  expect(onChange).toHaveBeenCalled();
});

test('HERE fires change event handler for setZoom', async () => {
  const { map } = await Test.createHereMapImplementation();

  const onChange = jest.fn();
  await map.addEventListener(Types.GeoEvent.Changed, onChange);
  expect(onChange).not.toHaveBeenCalled();

  await map.setZoom(10);
  expect(onChange).toHaveBeenCalled();
});

test('HERE fires change event handler for setType', async () => {
  const { map } = await Test.createHereMapImplementation();

  const onChange = jest.fn();
  await map.addEventListener(Types.GeoEvent.Changed, onChange);
  expect(onChange).not.toHaveBeenCalled();

  await map.setType(Types.GeoMapType.Roadmap);
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('HERE click carries lat/lng payload', async () => {
  const { el, map, window } = await Test.createHereMapImplementation();

  const onClick = jest.fn();
  await map.addEventListener(Types.GeoEvent.Click, onClick);

  const event = simulant(window, 'click');
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
});

test('GeoMapHere.coversLocation returns true for location in view bounds', async () => {
  const { map } = await Test.createHereMapImplementation(); // Mock bounds are n: 1, east: -1, south: -1, west: 1
  const covered = await map.coversLocation({ lat: 0, lng: 0 });
  expect(covered).toBe(true);
});

test('GeoMapHere.coversLocation returns false for location outside view bounds', async () => {
  const { map } = await Test.createHereMapImplementation(); // Mock bounds are n: 1, east: -1, south: -1, west: 1
  const covered = await map.coversLocation({ lat: 2, lng: 2 });
  expect(covered).toBe(false);
});
