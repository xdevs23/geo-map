import { GeoMarkerHere } from './geo-marker-here';
import * as Test from './test';

Test.jestCreateHereMapImpl(async donot => {
  test('respects initial icon', async () => {
    const icon = '<svg><text>Hello</text></svg>';

    const marker = GeoMarkerHere.create(
      {
        browserCtx: donot.hereMap.browserCtx,
        icon,
        position: Test.Constants.S2_HAM
      },
      { mapImplementation: donot.hereMap.map }
    );

    expect(await marker.getIcon()).toBe(icon);
  });

  test('may set icon', async () => {
    const icon = '<svg><text>Hello</text></svg>';

    const marker = GeoMarkerHere.create(
      {
        browserCtx: donot.hereMap.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation: donot.hereMap.map }
    );

    marker.setIcon(icon);
    expect(await marker.getIcon()).toBe(icon);
  });

  test('map hosts marker', async () => {
    const marker = GeoMarkerHere.create(
      {
        browserCtx: donot.hereMap.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation: donot.hereMap.map }
    );

    expect(await donot.hereMap.map.getMarkers()).toContain(marker);
  });

  test('map looses removed marker', async () => {
    const marker = GeoMarkerHere.create(
      {
        browserCtx: donot.hereMap.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation: donot.hereMap.map }
    );

    expect(await donot.hereMap.map.getMarkers()).toContain(marker);

    await marker.remove();

    expect(await donot.hereMap.map.getMarkers()).not.toContain(marker);
  });
});
