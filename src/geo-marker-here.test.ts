import { GeoMarkerHere } from './geo-marker-here';
import * as Test from './test';
import { browserCtxify } from './test';
import { LoadHereMapConfig } from './types';

test(
  'respects initial icon',
  Test.browserCtxify<LoadHereMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      config: browserCtx
    });
    const icon = '<svg><text>Hello</text></svg>';

    const marker = GeoMarkerHere.create(
      {
        browserCtx: browserCtx.browserCtx,
        icon,
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    expect(await marker.getIcon()).toBe(icon);
  })
);

test(
  'may set icon',
  Test.browserCtxify<LoadHereMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      config: browserCtx
    });
    const icon = '<svg><text>Hello</text></svg>';

    const marker = GeoMarkerHere.create(
      {
        browserCtx: browserCtx.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    marker.setIcon(icon);
    expect(await marker.getIcon()).toBe(icon);
  })
);

test(
  'map hosts marker',
  Test.browserCtxify<LoadHereMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      config: browserCtx
    });

    const marker = GeoMarkerHere.create(
      {
        browserCtx: browserCtx.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    expect(await mapImplementation.getMarkers()).toContain(marker);
  })
);

test(
  'map looses removed marker',
  Test.browserCtxify<LoadHereMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      config: browserCtx
    });

    const marker = GeoMarkerHere.create(
      {
        browserCtx: browserCtx.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    expect(await mapImplementation.getMarkers()).toContain(marker);

    await marker.remove();

    expect(await mapImplementation.getMarkers()).not.toContain(marker);
  })
);
