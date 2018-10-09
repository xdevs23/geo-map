import { GeoMarkerGoogle } from './geo-marker-google';
import * as Test from './test';

test('respects initial icon', async () => {
  const { map: mapImplementation } = await Test.createGoogleMapImplementation();
  const marker = GeoMarkerGoogle.create(
    {
      icon: Test.Constants.ICON,
      position: Test.Constants.S2_HAM
    },
    { mapImplementation }
  );

  expect(await marker.getIcon()).toBe(Test.Constants.ICON);
});

test('may set icon', async () => {
  const { map: mapImplementation } = await Test.createGoogleMapImplementation();

  const marker = GeoMarkerGoogle.create(
    { icon: '', position: Test.Constants.S2_HAM },
    { mapImplementation }
  );

  marker.setIcon(Test.Constants.ICON);
  expect(await marker.getIcon()).toBe(Test.Constants.ICON);
});

test('map hosts marker', async () => {
  const { map: mapImplementation } = await Test.createGoogleMapImplementation();

  const marker = GeoMarkerGoogle.create(
    { icon: '', position: Test.Constants.S2_HAM },
    { mapImplementation }
  );

  expect(await mapImplementation.getMarkers()).toContain(marker);
});

test('map looses removed marker', async () => {
  const { map: mapImplementation } = await Test.createGoogleMapImplementation();

  const marker = GeoMarkerGoogle.create(
    { icon: '', position: Test.Constants.S2_HAM },
    { mapImplementation }
  );

  expect(await mapImplementation.getMarkers()).toContain(marker);

  await marker.remove();

  expect(await mapImplementation.getMarkers()).not.toContain(marker);
});
