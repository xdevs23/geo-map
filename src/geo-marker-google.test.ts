import { GeoMarkerGoogle } from './geo-marker-google';
import * as Test from './test';
import * as Types from './types';

test(
  'respects initial icon',
  Test.browserCtxify<Types.LoadGoogleMapConfig>(async browserCfg => {
    const { map: mapImplementation } = await Test.createGoogleMapImplementation(
      {
        config: browserCfg
      }
    );
    const marker = GeoMarkerGoogle.create(
      {
        browserCtx: browserCfg.browserCtx,
        icon: Test.Constants.ICON,
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    expect(await marker.getIcon()).toBe(Test.Constants.ICON);
  })
);

test(
  'may set icon',
  Test.browserCtxify<Types.LoadGoogleMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createGoogleMapImplementation(
      {
        config: browserCtx
      }
    );

    const marker = GeoMarkerGoogle.create(
      {
        browserCtx: browserCtx.browserCtx,
        icon: '',
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    marker.setIcon(Test.Constants.ICON);
    expect(await marker.getIcon()).toBe(Test.Constants.ICON);
  })
);

test(
  'map hosts marker',
  Test.browserCtxify<Types.LoadGoogleMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createGoogleMapImplementation(
      {
        config: browserCtx
      }
    );

    const marker = GeoMarkerGoogle.create(
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
  Test.browserCtxify<Types.LoadGoogleMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createGoogleMapImplementation(
      {
        config: browserCtx
      }
    );

    const marker = GeoMarkerGoogle.create(
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
