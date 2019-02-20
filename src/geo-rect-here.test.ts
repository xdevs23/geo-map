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
    const refBound = { north: 3, west: 2, south: -3, east: -2 };
    const rect = GeoRectHere.create(refBound, { mapImplementation });
    const actual = await rect.getBounds();
    expect(actual).toEqual(refBound);
  })
);

test(
  'HERE rect accepts from bounds',
  Test.browserCtxify<LoadHereMapConfig>(async browserCtx => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      config: browserCtx,
      mount: { zoom: 2, center: Test.Constants.S2_HAM }
    });
    const rect = GeoRectHere.create(
      { north: 1, west: 2, south: 3, east: 4 },
      { mapImplementation }
    );
    const actual = await rect.getBounds();

    const rect1 = GeoRectHere.from(rect.toRect(), { mapImplementation });
    const actual1 = await rect1.getBounds();

    expect(actual).toEqual(actual1);
  })
);
