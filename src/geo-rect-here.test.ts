import { GeoRectHere } from './geo-rect-here';
import * as Test from './test';
import { LoadHereMapConfig } from './types';

test(
  'HERE rect accepts constructor bounds',
  Test.browserCtxify<LoadHereMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      config: browserCtx,
      mount: { zoom: 2, center: Test.Constants.S2_HAM }
    });
    const rect = GeoRectHere.create(
      { north: 0, east: 1, south: 1, west: 0 },
      { mapImplementation }
    );

    const actual = await rect.getBounds();
    const expected = { north: 0, east: 1, south: 1, west: 0 };

    expect(actual).toEqual(expected);
  })
);
