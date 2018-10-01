import { loadMapApi } from './load-map-api';
import * as Test from '../test';
import * as Types from '../types';

const auth = { clientId: Test.Constants.GOOGLE_MAP_CLIENT_ID };

test('returns a failure map result for faulty map provider', async () => {
  // tslint:disable-next-line:no-any
  const mapResult = await loadMapApi({ provider: 'Algolia' } as any);
  expect(mapResult.result.type).toBe(Types.ResultType.Failure);
});

test('returns the passed map provider for Google', async () => {
  const window = Test.createWindow();
  const googleResult = await loadMapApi({ provider: Types.GeoMapProvider.Google, auth}, { window });
  expect(googleResult.provider).toBe(Types.GeoMapProvider.Google);
});

test('returns the passed map provider for HERE', async () => {
  const window = Test.createWindow();
  // tslint:disable-next-line:no-any
  (window as any).H = Test.createHMock();

  const hereResult = await loadMapApi({ provider: Types.GeoMapProvider.Here, appCode: Test.Constants.HERE_APP_CODE, appId: Test.Constants.HERE_APP_ID }, { window });
  expect(hereResult.provider).toBe(Types.GeoMapProvider.Here);
});

test('injects a script tag for google', async () => {
  const window = Test.createWindow();
  await loadMapApi({ provider: Types.GeoMapProvider.Google, auth}, { window });

  const scripts = window.document.querySelectorAll(`script[data-map-provider=${Types.GeoMapProvider.Google}]`);
  expect(scripts).toHaveLength(1);
});

test('injects no more than one script tag for google parallely', async () => {
  const window = Test.createWindow();

  await Promise.all([
    loadMapApi({ provider: Types.GeoMapProvider.Google, auth}, {window}),
    loadMapApi({ provider: Types.GeoMapProvider.Google, auth}, {window})
  ]);

  const scripts = window.document.querySelectorAll(`script[data-map-provider=${Types.GeoMapProvider.Google}]`);
  expect(scripts).toHaveLength(1);
});

test('injects no more than one script tag for google sequentially', async () => {
  const window = Test.createWindow();

  await loadMapApi({ provider: Types.GeoMapProvider.Google, auth}, {window});
  await loadMapApi({ provider: Types.GeoMapProvider.Google, auth}, {window});

  const scripts = window.document.querySelectorAll(`script[data-map-provider=${Types.GeoMapProvider.Google}]`);
  expect(scripts).toHaveLength(1);
});

test('injects three script tags for here', async () => {
  const window = Test.createWindow();

  // tslint:disable-next-line:no-any
  (window as any).H = Test.createHMock();

  await loadMapApi({ provider: Types.GeoMapProvider.Here, appCode: Test.Constants.HERE_APP_CODE, appId: Test.Constants.HERE_APP_ID }, { window });

  const scripts = window.document.querySelectorAll(`script[data-map-provider=${Types.GeoMapProvider.Here}]`);
  expect(scripts).toHaveLength(3);
});

test('injects no more than three script tags for here', async () => {
  const window = Test.createWindow();

  // tslint:disable-next-line:no-any
  (window as any).H = Test.createHMock();

  await loadMapApi({ provider: Types.GeoMapProvider.Here, appCode: Test.Constants.HERE_APP_CODE, appId: Test.Constants.HERE_APP_ID }, { window });
  await loadMapApi({ provider: Types.GeoMapProvider.Here, appCode: Test.Constants.HERE_APP_CODE, appId: Test.Constants.HERE_APP_ID }, { window });

  const scripts = window.document.querySelectorAll(`script[data-map-provider=${Types.GeoMapProvider.Here}]`);
  expect(scripts).toHaveLength(3);
});
